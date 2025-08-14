
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// PUT /api/fasilitas/[id]

<<<<<<< HEAD
export async function PUT(req: NextRequest, context: { params: Record<string, string> }) {
  try {
  const id = context.params.id;
=======
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
>>>>>>> 42a4b6686bd62956ef12b62fa1968da6f1147c7a
    const data = await req.json();
    await updateDoc(doc(db, "fasilitas", id), data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal update fasilitas" }, { status: 500 });
  }
}

// DELETE /api/fasilitas/[id]

<<<<<<< HEAD
export async function DELETE(_req: NextRequest, context: { params: Record<string, string> }) {
  try {
  const id = context.params.id;
=======
export async function DELETE(_req: NextRequest, context: { params: { id: string } }) {
  try {
    const id = context.params.id;
>>>>>>> 42a4b6686bd62956ef12b62fa1968da6f1147c7a
    await deleteDoc(doc(db, "fasilitas", id));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal hapus fasilitas" }, { status: 500 });
  }
}
