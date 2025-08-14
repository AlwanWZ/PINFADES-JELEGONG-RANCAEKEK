import { getDocs, doc, updateDoc } from "firebase/firestore";
// GET /api/peminjaman
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "peminjaman"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Gagal mengambil data peminjaman" }, { status: 500 });
  }
}

// PUT /api/peminjaman
export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID dan status wajib diisi" }, { status: 400 });
    }
    const ref = doc(db, "peminjaman", id);
    await updateDoc(ref, { status });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal update status peminjaman" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// POST /api/peminjaman
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      barangId = "",
      namaBarang = "",
      userId = "",
      jumlah = 1,
      status = "",
      catatan = "",
      tanggalPinjam = "",
      tanggalKembali = "",
      keterangan = "",
      nama = "", // nama lengkap peminjam
      nik = "",
      alamat = ""
    } = body;

    // Validasi field wajib
    if (!barangId || !namaBarang || !userId || jumlah === undefined || jumlah === null || jumlah < 1 || !tanggalPinjam || !tanggalKembali) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Konversi tanggal ke Timestamp jika string
    let tglPinjam = tanggalPinjam;
    let tglKembali = tanggalKembali;
    // Pastikan string tanggal valid ISO agar new Date() tidak NaN
    if (typeof tanggalPinjam === "string" && !isNaN(Date.parse(tanggalPinjam))) {
      tglPinjam = Timestamp.fromDate(new Date(tanggalPinjam));
    }
    if (typeof tanggalKembali === "string" && !isNaN(Date.parse(tanggalKembali))) {
      tglKembali = Timestamp.fromDate(new Date(tanggalKembali));
    }

    await addDoc(collection(db, "peminjaman"), {
      barangId,
      namaBarang,
      userId,
      nama: nama || userId, // fallback ke userId (NIK) jika nama kosong
      nik,
      alamat,
      jumlah,
      status,
      catatan,
      keterangan,
      tanggalPinjam: tglPinjam,
      tanggalKembali: tglKembali,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengajukan peminjaman" }, { status: 500 });
  }
}
