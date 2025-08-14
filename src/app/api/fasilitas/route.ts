import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { retrieveData } from "../../../lib/firebase/service";
// GET /api/fasilitas
export async function GET() {
  try {
    const data = await retrieveData("fasilitas");
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Error GET /api/fasilitas:", err);
    return NextResponse.json({ error: "Gagal mengambil data fasilitas", detail: String(err) }, { status: 500 });
  }
}

// POST /api/fasilitas
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, tipe, lokasi, status, deskripsi, harga, kodeBarang, jumlahTotal, jumlahDipinjam } = body;
    if (!nama || !tipe || !lokasi || !status || jumlahTotal === undefined || jumlahDipinjam === undefined) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    // Cek duplikasi nama fasilitas
    const q = query(collection(db, "fasilitas"), where("nama", "==", nama));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return NextResponse.json({ error: "Fasilitas sudah ada" }, { status: 409 });
    }
    await addDoc(collection(db, "fasilitas"), {
      nama,
      tipe,
      lokasi,
      status,
      deskripsi: deskripsi || "",
      harga: harga !== undefined ? harga : null,
      kodeBarang: kodeBarang || "",
      jumlahTotal,
      jumlahDipinjam,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menambah fasilitas" }, { status: 500 });
  }
}
