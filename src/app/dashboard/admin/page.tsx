"use client";

import NavbarAdmin from "./navbaradm";
import { FaUsers, FaChair, FaClipboardList, FaPlusCircle, FaUserShield } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(true); // default dark
  const [loading, setLoading] = useState(true);
  const [wargaCount, setWargaCount] = useState<number>(0);
  const [fasilitasCount, setFasilitasCount] = useState<number>(0);
  const [peminjaman, setPeminjaman] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = localStorage.getItem("admin_welcome_shown");
      if (!shown) {
        setShowWelcome(true);
        localStorage.setItem("admin_welcome_shown", "1");
      }
    }
  }, []);

  // Cek autentikasi dan role admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      // Cek role di Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const data = userSnap.data();
      if (!data || data.role !== "admin") {
        router.replace("/login");
        return;
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (checkingAuth) return;
    setLoading(true);
    Promise.all([
      fetch("/api/warga").then(r => r.json()),
      fetch("/api/fasilitas").then(r => r.json()),
      fetch("/api/peminjaman").then(r => r.json()),
    ]).then(([warga, fasilitas, peminjaman]) => {
      setWargaCount(Array.isArray(warga.data) ? warga.data.length : 0);
      setFasilitasCount(Array.isArray(fasilitas.data) ? fasilitas.data.length : 0);
      setPeminjaman(Array.isArray(peminjaman.data) ? peminjaman.data : []);
      setLoading(false);
    }).catch(() => {
      setError("Gagal memuat data dashboard");
      setLoading(false);
    });
  }, [checkingAuth]);

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
      <main
        className={`min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300 relative overflow-x-hidden
          ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-cyan-950 text-gray-200'
            : 'bg-gradient-to-br from-green-100 via-cyan-100 to-emerald-100 text-emerald-900'}
        `}
      >
        {/* Notifikasi selamat datang admin */}
        {showWelcome && (
          <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 border font-bold text-base sm:text-lg
            ${darkMode ? 'bg-cyan-900/95 border-cyan-700 text-cyan-100' : 'bg-cyan-50 border-cyan-300 text-cyan-900'}`}
            style={{minWidth:'260px'}}
          >
            <span>Selamat datang admin pinfades jelegong</span>
            <button
              onClick={() => setShowWelcome(false)}
              className={`ml-2 px-2 py-1 rounded hover:bg-cyan-800/30 transition font-bold text-lg ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}
              title="Tutup"
            >
              &times;
            </button>
          </div>
        )}
        {/* Decorative blurred background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl z-0" />
        <div className="absolute top-40 right-0 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl z-0" />
        <header className="relative flex flex-col items-center mb-8 gap-2 z-10">
          <span className="flex items-center gap-2 mb-1">
            <FaUserShield className={`text-3xl sm:text-4xl ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${darkMode ? 'text-white' : ''}`}>Dashboard Admin</h1>
          </span>
          <span className={`text-sm sm:text-base font-medium ${darkMode ? 'text-cyan-200/80' : 'text-cyan-800/80'}`}>Pantau & kelola seluruh aktivitas peminjaman fasilitas desa</span>
          <div className="w-32 h-1 mt-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 opacity-70" />
        </header>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="loader-spinner mb-4" />
            <span className="text-lg font-semibold text-cyan-400">Memuat data dashboard...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-bold">{error}</div>
        ) : (
          <>
            <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12 z-10 relative">
              <div
                className={`rounded-2xl shadow-2xl p-6 sm:p-8 flex items-center gap-4 border-l-8 backdrop-blur-md
                  ${darkMode
                    ? 'bg-cyan-900/60 border-cyan-500'
                    : 'bg-white/70 border-cyan-400'}
                `}
              >
                <div className="bg-cyan-400/30 rounded-full p-3 flex items-center justify-center">
                  <FaUsers className={`text-3xl sm:text-4xl ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`} />
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-cyan-900'}`}>{wargaCount}</div>
                  <div className={`text-xs sm:text-base font-semibold ${darkMode ? 'text-cyan-100' : 'text-cyan-700'}`}>Total Warga</div>
                </div>
              </div>
              <div
                className={`rounded-2xl shadow-2xl p-6 sm:p-8 flex items-center gap-4 border-l-8 backdrop-blur-md
                  ${darkMode
                    ? 'bg-emerald-900/60 border-emerald-500'
                    : 'bg-emerald-100/80 border-emerald-400'}
                `}
              >
                <div className="bg-emerald-400/30 rounded-full p-3 flex items-center justify-center">
                  <FaChair className={`text-3xl sm:text-4xl ${darkMode ? 'text-emerald-200' : 'text-emerald-700'}`} />
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-emerald-900'}`}>{fasilitasCount}</div>
                  <div className={`text-xs sm:text-base font-semibold ${darkMode ? 'text-emerald-100' : 'text-emerald-700'}`}>Fasilitas</div>
                </div>
              </div>
              <div
                className={`rounded-2xl shadow-2xl p-6 sm:p-8 flex items-center gap-4 border-l-8 backdrop-blur-md
                  ${darkMode
                    ? 'bg-cyan-900/60 border-cyan-500'
                    : 'bg-white/70 border-cyan-400'}
                `}
              >
                <div className="bg-cyan-400/30 rounded-full p-3 flex items-center justify-center">
                  <FaClipboardList className={`text-3xl sm:text-4xl ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`} />
                </div>
                <div>
                  <div className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-cyan-900'}`}>{peminjaman.length}</div>
                  <div className={`text-xs sm:text-base font-semibold ${darkMode ? 'text-cyan-100' : 'text-cyan-700'}`}>Peminjaman Aktif</div>
                </div>
              </div>
            </section>
            <section className={`rounded-3xl shadow-2xl p-3 sm:p-6 md:p-8 mb-8 sm:mb-12 backdrop-blur-xl border border-cyan-200/30 ${darkMode ? 'bg-gray-900/70' : 'bg-white/70'}`}>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-5">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-cyan-900'}`}>
                  <FaClipboardList className="text-cyan-400" /> Daftar Peminjaman
                </h2>
                <Link href="#" className={`flex items-center gap-2 hover:underline font-bold ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}><FaPlusCircle /> Tambah Peminjaman</Link>
              </div>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-[500px] w-full text-xs sm:text-sm">
                  <thead>
                    <tr className={`${darkMode ? 'bg-cyan-900/80 text-white' : 'bg-cyan-100/80 text-cyan-900'} font-bold`}>
                      <th className="py-2 px-2 sm:px-4 text-left">Nama</th>
                      <th className="py-2 px-2 sm:px-4 text-left">Fasilitas</th>
                      <th className="py-2 px-2 sm:px-4 text-left">Tanggal</th>
                      <th className="py-2 px-2 sm:px-4 text-left">Status</th>
                      <th className="py-2 px-2 sm:px-4 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peminjaman.map((item, idx) => (
                      <tr key={item.id || idx} className={darkMode ? 'border-b border-cyan-800/60 hover:bg-cyan-950/60' : 'border-b hover:bg-cyan-50/80'}>
                        <td className={`py-2 px-2 sm:px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.nama}</td>
                        <td className={`py-2 px-2 sm:px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.fasilitas}</td>
                        <td className={`py-2 px-2 sm:px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{
                          item.tanggalPinjam
                            ? typeof item.tanggalPinjam === 'object' && item.tanggalPinjam.seconds
                              ? new Date(item.tanggalPinjam.seconds * 1000).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
                              : item.tanggalPinjam
                            : '-'
                        }</td>
                        <td className="py-2 px-2 sm:px-4">
                          <span className={
                            item.status === "Disetujui"
                              ? darkMode
                                ? 'bg-cyan-800/80 text-cyan-100 px-2 py-1 rounded font-bold'
                                : 'bg-cyan-200/80 text-cyan-800 px-2 py-1 rounded font-bold'
                              : item.status === "Menunggu"
                              ? darkMode
                                ? 'bg-yellow-700/80 text-yellow-200 px-2 py-1 rounded font-bold'
                                : 'bg-yellow-200/80 text-yellow-800 px-2 py-1 rounded font-bold'
                              : darkMode
                              ? 'bg-red-800/80 text-red-200 px-2 py-1 rounded font-bold'
                              : 'bg-red-200/80 text-red-800 px-2 py-1 rounded font-bold'
                          }>{item.status}</span>
                        </td>
                        <td className="py-2 px-2 sm:px-4"><button className={darkMode ? 'text-red-400 hover:underline font-bold' : 'text-red-600 hover:underline font-bold'}>Hapus</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
        <section className="flex flex-col xs:flex-row flex-wrap gap-4 sm:gap-6 mt-2 mb-2 sm:mb-0 z-10 relative">
          <Link
            href="/dashboard/admin/fasilitas"
            className={`w-full xs:w-auto px-7 py-4 rounded-2xl shadow-xl border-2 font-bold flex items-center justify-center gap-3 transition text-center text-lg sm:text-xl
              ${darkMode ? 'bg-gradient-to-r from-cyan-700 via-cyan-800 to-cyan-900 border-cyan-900 text-white hover:from-cyan-800 hover:to-cyan-950 active:scale-95' : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 border-cyan-300 text-white hover:from-cyan-500 hover:to-cyan-700 active:scale-95'}`}
          >
            Kelola Fasilitas
          </Link>
          <Link
            href="/dashboard/admin/warga"
            className={`w-full xs:w-auto px-7 py-4 rounded-2xl shadow-xl border-2 font-bold flex items-center justify-center gap-3 transition text-center text-lg sm:text-xl
              ${darkMode ? 'bg-gradient-to-r from-cyan-900 via-cyan-800 to-cyan-700 border-cyan-900 text-cyan-200 hover:from-cyan-800 hover:to-cyan-700 active:scale-95' : 'bg-gradient-to-r from-cyan-100 via-cyan-200 to-cyan-300 border-cyan-300 text-cyan-900 hover:from-cyan-200 hover:to-cyan-400 active:scale-95'}`}
          >
            Kelola Warga
          </Link>
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
        `}</style>
      </main>
    </>
  );
}

