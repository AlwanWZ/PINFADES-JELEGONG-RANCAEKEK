"use client";
import NavbarWarga from "../navbarwrg";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

export default function RiwayatPage() {
  const [darkMode, setDarkMode] = useState(true); // default dark
  const [riwayatList, setRiwayatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ambil uid dari localStorage hanya di client
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedUid = localStorage.getItem("uid");
      setUid(storedUid && storedUid.trim() !== '' ? storedUid : null);
    }
  }, []);

  // Fetch data riwayat real dari Firestore berdasarkan uid
  useEffect(() => {
    if (!uid) {
      setRiwayatList([]);
      setLoading(false);
      return;
    }
    const fetchRiwayat = async () => {
      setLoading(true);
      try {
        console.log("[RIWAYAT] uid dipakai query:", uid);
        const q = query(collection(db, "peminjaman"), where("userId", "==", uid));
        const snap = await getDocs(q);
        console.log("[RIWAYAT] jumlah data ditemukan:", snap.size);
        snap.docs.forEach(doc => console.log("[RIWAYAT] data:", doc.data()));
        setRiwayatList(snap.docs.map(doc => {
          const data = doc.data();
          // Helper konversi Firestore Timestamp ke string
          function parseTanggal(val: { seconds: number; }) {
            if (!val) return "-";
            if (typeof val === "string") return val;
            if (val.seconds) {
              const d = new Date(val.seconds * 1000);
              return d.toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' });
            }
            return String(val);
          }
          return {
            id: doc.id,
            fasilitas: data.fasilitas || data.namaBarang || "-",
            tanggal: parseTanggal(data.tanggalPinjam || data.tanggal),
            status: data.status || "Menunggu",
            keterangan: data.catatan || data.keterangan || "",
          };
        }));
      } catch (err) {
        console.error("[RIWAYAT] error Firestore:", err);
        setRiwayatList([]);
      }
      setLoading(false);
    };
    fetchRiwayat();
  }, [uid]);

  const handleDelete = (idx: number) => {
    setRiwayatList((prev) => prev.filter((_, i) => i !== idx));
  };

  if (!isClient) return null;
  return (
    <>
      <NavbarWarga darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-0 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}>
        <div className="flex justify-start mb-2">
          <Link
            href="/dashboard/warga"
            className={`px-3 py-1.5 rounded-lg shadow-sm font-semibold flex items-center gap-1 transition text-xs sm:text-sm border
              ${darkMode ? 'bg-cyan-900 border-cyan-800 text-cyan-200 hover:bg-cyan-800' : 'bg-cyan-100 border-cyan-300 text-cyan-800 hover:bg-cyan-200'}`}
            style={{ minWidth: 'unset' }}
          >
            &larr; Dashboard
          </Link>
        </div>
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-3xl md:text-4xl font-extrabold ${darkMode ? 'text-white' : ''}`}>Riwayat Peminjaman</h1>
        </header>
        <section className="rounded-2xl shadow-xl p-2 md:p-6 mb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="loader-spinner mb-4" />
              <span className="text-lg font-semibold">Memuat riwayat peminjaman...</span>
            </div>
          ) : (
            <>
              {/* Desktop/tablet table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className={`${darkMode ? 'bg-cyan-900 text-white' : 'bg-cyan-100 text-cyan-900'} font-bold`}>
                      <th className="py-2 px-4 text-left">Fasilitas</th>
                      <th className="py-2 px-4 text-left">Tanggal</th>
                      <th className="py-2 px-4 text-left">Keterangan</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatList.map((item, idx) => (
                      <tr key={item.id || idx} className={`${darkMode ? 'border-b border-cyan-800 hover:bg-cyan-950' : 'border-b hover:bg-cyan-50'} transition`}>
                        <td className={`py-2 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.fasilitas}</td>
                        <td className={`py-2 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.tanggal}</td>
                        <td className={`py-2 px-4 ${darkMode ? 'text-cyan-100' : 'text-cyan-800'}`}>{item.keterangan}</td>
                        <td className="py-2 px-4">
                          {item.status === "Disetujui" && (
                            <span className="flex items-center gap-1 bg-cyan-800 text-cyan-100 px-2 py-1 rounded font-bold"><FaCheckCircle className="text-emerald-300" /> Disetujui</span>
                          )}
                          {item.status === "Menunggu" && (
                            <span className="flex items-center gap-1 bg-yellow-700 text-yellow-200 px-2 py-1 rounded font-bold"><FaClock className="text-yellow-300" /> Menunggu</span>
                          )}
                          {item.status === "Ditolak" && (
                            <span className="flex items-center gap-1 bg-red-800 text-red-200 px-2 py-1 rounded font-bold"><FaTimesCircle className="text-red-300" /> Ditolak</span>
                          )}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            aria-label="Hapus riwayat"
                            onClick={() => handleDelete(idx)}
                            className={`p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition`}
                            title="Hapus riwayat"
                          >
                            <FaTrash className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile card list */}
              <div className="flex flex-col gap-4 md:hidden">
                {riwayatList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`rounded-xl shadow p-4 flex flex-col gap-2 border ${darkMode ? 'bg-cyan-950 border-cyan-800' : 'bg-white border-cyan-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-base md:text-lg ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.fasilitas}</span>
                      <span className={`text-xs md:text-sm font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>{item.tanggal}</span>
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-cyan-100' : 'text-cyan-800'}`}>{item.keterangan}</div>
                    <div className="mt-1 flex items-center gap-2">
                      {item.status === "Disetujui" && (
                        <span className="inline-flex items-center gap-1 bg-cyan-800 text-cyan-100 px-2 py-1 rounded font-bold text-xs"><FaCheckCircle className="text-emerald-300" /> Disetujui</span>
                      )}
                      {item.status === "Menunggu" && (
                        <span className="inline-flex items-center gap-1 bg-yellow-700 text-yellow-200 px-2 py-1 rounded font-bold text-xs"><FaClock className="text-yellow-300" /> Menunggu</span>
                      )}
                      {item.status === "Ditolak" && (
                        <span className="inline-flex items-center gap-1 bg-red-800 text-red-200 px-2 py-1 rounded font-bold text-xs"><FaTimesCircle className="text-red-300" /> Ditolak</span>
                      )}
                      <button
                        aria-label="Hapus riwayat"
                        onClick={() => handleDelete(idx)}
                        className={`ml-auto p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition`}
                        title="Hapus riwayat"
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
        <div className="flex justify-center mt-6">
          <Link
            href="/dashboard/warga/ajukan"
            className={`w-full md:w-auto text-center px-6 py-3 rounded-xl shadow font-bold transition ${darkMode ? 'bg-cyan-700 text-white hover:bg-cyan-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
          >
            Ajukan Peminjaman Baru
          </Link>
        </div>
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

