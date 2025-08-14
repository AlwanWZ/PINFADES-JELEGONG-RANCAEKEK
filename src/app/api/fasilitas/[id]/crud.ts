import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// PUT /api/fasilitas/[id]
export async function PUT(req: NextRequest, context: { params: any }) {
  try {
    const id = context.params.id;
    const data = await req.json();
    await updateDoc(doc(db, "fasilitas", id), data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal update fasilitas" }, { status: 500 });
  }
}

// DELETE /api/fasilitas/[id]
export async function DELETE(_req: NextRequest, context: { params: any }) {
  try {
    const id = context.params.id;
    await deleteDoc(doc(db, "fasilitas", id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal hapus fasilitas" }, { status: 500 });
  }
}
