// DELETE /api/notifikasi?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }
    const { doc, deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, "notifikasi", id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menghapus notifikasi" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

// POST /api/notifikasi
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      uid = "",
      type = "",
      title = "",
      message = "",
      status = "",
      barangId = "",
      namaBarang = "",
      peminjamanId = "",
      adminId = "",
      meta = {},
    } = body;

    if (!uid || !title || !message) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, "notifikasi"), {
      uid,
      type,
      title,
      message,
      status,
      barangId,
      namaBarang,
      peminjamanId,
      adminId,
      meta,
      read: false,
      tanggal: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menambah notifikasi" }, { status: 500 });
  }
}

// GET /api/notifikasi?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || searchParams.get("userId");
    if (!uid) {
      return NextResponse.json({ error: "uid wajib diisi" }, { status: 400 });
    }
    // Query hanya berdasarkan uid
    const q = query(
      collection(db, "notifikasi"),
      where("uid", "==", uid),
      orderBy("tanggal", "desc")
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("[API NOTIFIKASI] Jumlah ditemukan:", data.length);
    data.forEach(n => console.log("[API NOTIFIKASI] data:", n));
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[API NOTIFIKASI] ERROR:", err);
    return NextResponse.json({ error: "Gagal mengambil notifikasi", detail: String(err) }, { status: 500 });
  }
}
