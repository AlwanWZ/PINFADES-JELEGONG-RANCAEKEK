import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

// POST /api/regis
export async function POST(req: NextRequest) {
  try {
    const { uid, email, username } = await req.json();
    if (!uid || !email || !username) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    // Simpan user ke Firestore (collection: users, docId: uid)
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      username,
      role: "warga",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan user" }, { status: 500 });
  }
}
 
