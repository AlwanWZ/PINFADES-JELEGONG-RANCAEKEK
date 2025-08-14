
"use client";
import { useState, useEffect } from "react";
import NavbarAdmin from "../navbaradm";
import Link from "next/link";
import { FaUser, FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";



export default function WargaAdminPage() {
  // All hooks must be called unconditionally and in the same order
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // default dark
  interface WargaItem {
    uid: string;
    nama: string;
    email: string;
    role: string;
  }
  const [warga, setWarga] = useState<WargaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let isMounted = true;
    const checkAuthAndFetch = () => {
      unsub = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.data();
        if (!data || data.role !== "admin") {
          router.replace("/login");
          return;
        }
        if (isMounted) setCheckingAuth(false);
        // Fetch warga setelah lolos autentikasi
        setLoading(true);
        setError("");
        try {
          const res = await fetch("/api/users");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setWarga(json.data
              .filter((u: any) => u.role !== "admin" && (u.role === "warga" || u.role === "user"))
              .map((u: any) => ({
                uid: u.uid || u.id || "-",
                nama: u.nama || u.username || "-",
                email: u.email || "-",
                role: u.role
              }))
            );
          } else {
            setError("Gagal memuat data warga");
          }
        } catch (err) {
          setError("Gagal memuat data warga");
        }
        setLoading(false);
      });
    };
    checkAuthAndFetch();
    return () => {
      isMounted = false;
      if (unsub) unsub();
    };
  }, [router]);

  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="loader-spinner mb-4" />
        <span className="text-lg font-semibold text-cyan-400">Memeriksa akses admin...</span>
      </main>
    );
  }



  return (
    <>
      <NavbarAdmin darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-0 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}>
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-cyan-900'}`}>Kelola Warga</h1>
          <Link href="/dashboard/admin" className={`hover:underline font-bold ${darkMode ? 'text-emerald-200' : 'text-cyan-700'}`}>Kembali ke Dashboard</Link>
        </header>
        <section className={`rounded-2xl shadow-xl p-6 mb-10 ${darkMode ? 'bg-gray-800/90' : 'bg-white'}`}>
          {/* Tidak ada form tambah/edit, hanya tampil data warga dari pengajuan */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="loader-spinner mb-4" />
              <span className="text-lg font-semibold text-cyan-400">Memuat data warga...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-2xl shadow-lg overflow-hidden border border-cyan-100 dark:border-cyan-900">
                <thead>
                  <tr className={`${darkMode ? 'bg-cyan-900 text-white' : 'bg-cyan-100 text-cyan-900'} font-bold text-center`}>
                    <th className="py-3 px-4 text-center">Nama</th>
                    <th className="py-3 px-4 text-center">Email</th>
                    <th className="py-3 px-4 text-center">UID</th>
                  </tr>
                </thead>
                <tbody>
                  {warga.map((item, idx) => (
                    <tr
                      key={item.uid}
                      className={
                        `${darkMode
                          ? `border-b border-cyan-800 ${idx%2===0 ? 'bg-cyan-950/30' : ''} hover:bg-cyan-950/60 transition`
                          : `border-b border-cyan-100 ${idx%2===0 ? 'bg-cyan-50/60' : 'bg-white'} hover:bg-cyan-100/80 transition`} text-center`
                      }
                    >
                      <td
                        className={`py-3 px-4 font-bold rounded-l-xl ${darkMode ? 'text-cyan-200' : 'text-cyan-700'} text-base`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <FaUser className={`text-lg ${darkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
                          {item.nama}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 font-mono text-center ${darkMode ? 'text-cyan-200' : 'text-cyan-800'} text-base tracking-wider align-middle'}`}
                      >
                        {item.email}
                      </td>
                      <td
                        className={`py-3 px-4 ${darkMode ? 'text-cyan-200' : 'text-cyan-800'} text-base`}
                      >
                        {item.uid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <style jsx global>{`
          .loader-spinner {
            border: 4px solid #e0e7ef;
            border-top: 4px solid #06b6d4;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          table { border-collapse: separate !important; border-spacing: 0; }
          th, td { vertical-align: middle !important; }
        `}</style>
      </main>
    </>
  );
}
