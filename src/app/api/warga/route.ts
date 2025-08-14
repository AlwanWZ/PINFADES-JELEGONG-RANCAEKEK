import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// GET /api/warga - Ambil data warga unik dari pengajuan peminjaman
export async function GET() {
  try {
    const snap = await getDocs(collection(db, "peminjaman"));
    // Ambil data unik berdasarkan NIK
    const wargaMap = new Map();
    snap.forEach(doc => {
      const data = doc.data();
      if (data.nik) {
        wargaMap.set(data.nik, {
          nama: data.nama,
          nik: data.nik,
          alamat: data.alamat
        });
      }
    });
    const warga = Array.from(wargaMap.values());
    return NextResponse.json({ success: true, data: warga });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data warga" }, { status: 500 });
  }
}
