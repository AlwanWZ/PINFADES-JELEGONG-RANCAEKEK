import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";

// POST: Tambah pembayaran
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      peminjamanId,
      userId,
      namaUser,
      jumlah,
      metode,
      status = "pending",
      tanggalBayar,
      buktiBayarUrl = "",
      adminId = "",
      catatan = ""
    } = body;
    if (!peminjamanId || !userId || !jumlah || !metode) {
      return NextResponse.json({ error: "Data pembayaran tidak lengkap" }, { status: 400 });
    }
    const docRef = await addDoc(collection(db, "pembayaran"), {
      peminjamanId,
      userId,
      namaUser: namaUser || "",
      jumlah,
      metode,
      status,
      tanggalBayar: tanggalBayar ? Timestamp.fromDate(new Date(tanggalBayar)) : Timestamp.now(),
      buktiBayarUrl,
      adminId,
      catatan
    });
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menambah pembayaran", detail: String(e) }, { status: 500 });
  }
}

// GET: List pembayaran (opsional filter by userId atau peminjamanId)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const peminjamanId = searchParams.get("peminjamanId");
    const pembayaranCol = collection(db, "pembayaran");
    let pembayaranSnap;
    if (userId) {
      const q = query(pembayaranCol, where("userId", "==", userId));
      pembayaranSnap = await getDocs(q);
    } else if (peminjamanId) {
      const q = query(pembayaranCol, where("peminjamanId", "==", peminjamanId));
      pembayaranSnap = await getDocs(q);
    } else {
      pembayaranSnap = await getDocs(pembayaranCol);
    }
    const data = pembayaranSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ pembayaran: data });
  } catch (e) {
    return NextResponse.json({ error: "Gagal mengambil data pembayaran", detail: String(e) }, { status: 500 });
  }
}
