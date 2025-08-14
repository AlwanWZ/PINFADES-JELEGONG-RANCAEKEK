import { collection, getDocs } from "firebase/firestore";
// GET /api/users - Ambil semua user
export async function GET() {
  try {
    const snap = await getDocs(collection(db, "users"));
    const users = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid || doc.id,
        ...data
      };
    });
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { uid, email, username } = await req.json();
    if (!uid || !email || !username) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid,
        email,
        nama: username,
        role: "warga",
        createdAt: new Date().toISOString(),
      });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Gagal menyimpan user" }, { status: 500 });
  }
}
