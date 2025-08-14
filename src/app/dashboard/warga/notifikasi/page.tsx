"use client";
import NavbarWarga from "../navbarwrg";
import { useState, useEffect } from "react";
import { FaBell, FaCheckCircle, FaTimesCircle, FaTrashAlt, FaRegEye } from "react-icons/fa";
import Link from "next/link";

export default function NotifikasiPage() {
  const [darkMode, setDarkMode] = useState(true); // default dark
  const [notif, setNotif] = useState<any[]>([]);
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

  // Fetch notifikasi berdasarkan uid
  useEffect(() => {
    if (!uid) {
      setNotif([]);
      setLoading(false);
      return;
    }
    const fetchNotif = async () => {
      setLoading(true);
      try {
        console.log("[NOTIF] Ambil notifikasi untuk uid:", uid);
        const res = await fetch(`/api/notifikasi?uid=${uid}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Debug: tampilkan data mentah
          console.log('[NOTIF] RAW DATA:', json.data);
          // Kompatibilitas: filter notifikasi yang field uid == uid atau userId == uid
          let filtered = json.data.filter((n: any) => (n.uid === uid) || (n.userId === uid));
          // Jika tidak ada field uid/userId, fallback tampilkan semua (debug)
          if (filtered.length === 0 && json.data.length > 0) {
            filtered = json.data;
          }
          console.log("[NOTIF] Jumlah notifikasi cocok:", filtered.length);
          filtered.forEach((n: any) => console.log("[NOTIF] data:", n));
          setNotif(filtered.map((n: any) => ({
            id: n.id,
            barang: n.namaBarang || n.meta?.namaBarang || "-",
            status: n.status || n.meta?.status || (n.title?.toLowerCase().includes("setuju") ? "Disetujui" : n.title?.toLowerCase().includes("tolak") ? "Ditolak" : "Menunggu"),
            waktu: n.tanggal ? new Date(n.tanggal).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-",
            pesan: n.message || n.pesan || "",
            read: !!n.read,
          })));
        } else {
          console.warn("[NOTIF] Gagal fetch notifikasi atau data kosong untuk uid:", uid);
          setNotif([]);
        }
      } catch (e) {
        setNotif([]);
      }
      setLoading(false);
    };
    fetchNotif();
  }, [uid]);

  // Hapus notifikasi dari Firestore dan state
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifikasi?id=${id}`, { method: "DELETE" });
    } catch {}
    setNotif(notif.filter(n => n.id !== id));
  };

  // Tandai telah dibaca
  const handleMarkRead = (id: number) => {
    setNotif(notif.map(n => n.id === id ? { ...n, read: true } : n));
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
          <h1 className={`text-3xl md:text-4xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}><FaBell className="text-cyan-400" /> Notifikasi</h1>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 col-span-2">
              <div className="loader-spinner mb-4" />
              <span className="text-lg font-semibold text-cyan-400">Memuat notifikasi...</span>
            </div>
          ) : (
            <>
              {notif.length === 0 && (
                <div className={`rounded-xl shadow p-6 text-center font-semibold ${darkMode ? 'bg-gray-800/90 text-gray-400' : 'bg-white text-gray-500'}`}>Belum ada notifikasi.</div>
              )}
              {notif.map(n => (
                <div key={n.id} className={`rounded-xl shadow-lg p-6 border-l-8 flex flex-col gap-2 relative transition
                  ${darkMode ? 'bg-gray-800/90 border-cyan-700' : 'bg-white border-cyan-400'}
                  ${!n.read ? (darkMode ? 'ring-2 ring-cyan-600' : 'ring-2 ring-cyan-300') : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {n.status === "Disetujui" && <FaCheckCircle className="text-emerald-400 text-xl" />}
                    {n.status === "Menunggu" && <FaRegEye className="text-yellow-300 text-xl" />}
                    {n.status === "Ditolak" && <FaTimesCircle className="text-red-400 text-xl" />}
                    <span className={`font-bold text-lg ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>{n.barang}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${n.status === 'Disetujui' ? (darkMode ? 'bg-cyan-800 text-cyan-100' : 'bg-cyan-200 text-cyan-800') : n.status === 'Menunggu' ? (darkMode ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-200 text-yellow-800') : (darkMode ? 'bg-red-800 text-red-200' : 'bg-red-200 text-red-800')}`}>{n.status}</span>
                  </div>
                  <div className={`mb-1 ${darkMode ? 'text-cyan-100' : 'text-cyan-800'}`}>{n.pesan}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.waktu}</div>
                  <div className="flex gap-2 absolute top-3 right-3">
                    {!n.read && (
                      <button onClick={() => handleMarkRead(n.id)} title="Tandai telah dibaca" className={`p-1 rounded hover:bg-cyan-700/30 transition ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                        <FaRegEye />
                      </button>
                    )}
                    <button onClick={() => handleDelete(n.id)} title="Hapus" className={`p-1 rounded hover:bg-red-700/30 transition ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                      <FaTrashAlt />
                    </button>
                  </div>
                  {!n.read && <span className={`absolute top-3 left-3 w-2 h-2 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-cyan-500'} animate-pulse`} />}
                </div>
              ))}
            </>
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
        `}</style>
      </main>
    </>
  );
}
