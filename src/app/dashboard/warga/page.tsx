  "use client";

import NavbarWarga from "./navbarwrg";
import { useState, useEffect } from "react";
import { FaClipboardList, FaHistory, FaWhatsapp, FaUserFriends, FaUsers, FaBoxOpen, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";



export default function WargaDashboard() {
  const [darkMode, setDarkMode] = useState(true);
  const [totalPeminjaman, setTotalPeminjaman] = useState<number>(0);
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalFasilitas, setTotalFasilitas] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  // Ambil kode login unik dari localStorage
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  // Notifikasi terbaru
  const [notif, setNotif] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('uid');
      setUserId(uid && uid.trim() !== '' ? uid : null);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Total peminjaman
        const resPeminjaman = await fetch("/api/peminjaman");
        const jsonPeminjaman = await resPeminjaman.json();
        setTotalPeminjaman(jsonPeminjaman.success && Array.isArray(jsonPeminjaman.data) ? jsonPeminjaman.data.length : 0);

        // Total user aktif
        const resUser = await fetch("/api/users");
        const jsonUser = await resUser.json();
        setTotalUser(jsonUser.success && Array.isArray(jsonUser.data) ? jsonUser.data.length : 0);

        // Total fasilitas (bukan jumlah barang)
        const resFasilitas = await fetch("/api/fasilitas");
        const jsonFasilitas = await resFasilitas.json();
        if (jsonFasilitas.success && Array.isArray(jsonFasilitas.data)) {
          setTotalFasilitas(jsonFasilitas.data.length);
        } else {
          setTotalFasilitas(0);
        }
      } catch {
        setTotalPeminjaman(0);
        setTotalUser(0);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  // Fetch notifikasi terbaru
  useEffect(() => {
    if (!userId) {
      setNotif([]);
      return;
    }
    const fetchNotif = async () => {
      setNotifLoading(true);
      try {
        const res = await fetch(`/api/notifikasi?uid=${userId}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          // Ambil 3 notifikasi terbaru
          setNotif(json.data.slice(0, 3));
        } else {
          setNotif([]);
        }
      } catch {
        setNotif([]);
      }
      setNotifLoading(false);
    };
    fetchNotif();
  }, [userId]);



  if (!isClient) return null;
  // Format pesan WhatsApp
  const waNumber = "0895320695308";
  const waMessage = encodeURIComponent(
    `Halo Admin, saya ingin bertanya mengenai peminjaman fasilitas desa. Berikut kode login saya: ${userId || "-"}`
  );
  const waLink = `https://wa.me/62${waNumber.replace(/^0/, "")}?text=${waMessage}`;

  return (
    <>
      <NavbarWarga darkMode={darkMode} setDarkMode={setDarkMode} />
      <main
        className={`min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300 relative overflow-x-hidden
          ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-950 to-cyan-950 text-gray-200'
            : 'bg-gradient-to-br from-green-100 via-cyan-100 to-emerald-100 text-emerald-900'}
        `}
      >
        {userId === null && (
          <div className="text-center text-red-500 font-bold mb-8">Silakan login terlebih dahulu untuk mengakses fitur ini.</div>
        )}
        {/* Decorative blurred background shapes */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl z-0" />
        <div className="absolute top-40 right-0 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl z-0" />
        <header className="relative flex flex-col items-center mb-8 gap-2 z-10">
          <span className="flex items-center gap-2 mb-1">
            <FaUserFriends className={`text-3xl sm:text-4xl ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${darkMode ? 'text-white' : ''}`}>Dashboard Warga</h1>
          </span>
          <span className={`text-sm sm:text-base font-medium ${darkMode ? 'text-cyan-200/80' : 'text-cyan-800/80'}`}>Kelola & pantau peminjaman fasilitas desa dengan mudah</span>
          {userId && (
            <span className={`text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-lg mt-1 ${darkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-100 text-cyan-800'}`}
              title="Kode login unik Anda (UID)">
              Kode Login Anda: <span className="select-all">{userId}</span>
            </span>
          )}
          <div className="w-32 h-1 mt-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 opacity-70" />
          {/* Tombol chat admin via WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold shadow bg-green-500 hover:bg-green-600 text-white transition text-base`}
            title="Chat Admin via WhatsApp"
          >
            <FaWhatsapp className="text-2xl" /> Chat Admin
          </a>
        </header>
        {/* Kartu statistik utama */}
        <section className="mb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {/* Total User Aktif */}
            <div className={`rounded-2xl shadow-lg p-2 sm:p-6 flex flex-col items-center bg-gradient-to-br ${darkMode ? 'from-cyan-900 via-cyan-950 to-emerald-900' : 'from-cyan-100 via-emerald-100 to-white'} transition`}>
              <FaUsers className={`text-xl sm:text-4xl mb-1 sm:mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
              <div className="text-xs sm:text-lg font-semibold mb-0.5 sm:mb-1">User Aktif</div>
              <div className="text-lg sm:text-3xl font-extrabold">{loading ? '...' : totalUser}</div>
            </div>
            {/* Total Fasilitas */}
            <div className={`rounded-2xl shadow-lg p-2 sm:p-6 flex flex-col items-center bg-gradient-to-br ${darkMode ? 'from-emerald-900 via-cyan-950 to-cyan-900' : 'from-emerald-100 via-cyan-100 to-white'} transition`}>
              <FaBoxOpen className={`text-xl sm:text-4xl mb-1 sm:mb-2 ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`} />
              <div className="text-xs sm:text-lg font-semibold mb-0.5 sm:mb-1">Total Fasilitas</div>
              <div className="text-lg sm:text-3xl font-extrabold">{loading ? '...' : totalFasilitas}</div>
            </div>
            {/* Total Peminjaman */}
            <div className={`rounded-2xl shadow-lg p-2 sm:p-6 flex flex-col items-center bg-gradient-to-br ${darkMode ? 'from-cyan-900 via-emerald-900 to-cyan-950' : 'from-cyan-100 via-emerald-100 to-white'} transition`}>
              <FaClipboardList className={`text-xl sm:text-4xl mb-1 sm:mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
              <div className="text-xs sm:text-lg font-semibold mb-0.5 sm:mb-1">Total Peminjaman</div>
              <div className="text-lg sm:text-3xl font-extrabold">{loading ? '...' : totalPeminjaman}</div>
            </div>
          </div>
        </section>

        {/* Notifikasi terbaru */}
        <section className="max-w-4xl mx-auto mb-10">
          <div className={`rounded-xl p-5 shadow flex flex-col gap-3 bg-gradient-to-r ${darkMode ? 'from-cyan-950 via-emerald-950 to-cyan-900' : 'from-cyan-50 via-emerald-50 to-white'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FaClipboardList className={`text-xl ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
              <span className="font-bold text-lg">Notifikasi Terbaru</span>
              <Link href="/dashboard/warga/notifikasi" className={`ml-auto text-xs font-semibold underline ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>Lihat Semua</Link>
            </div>
            {notifLoading ? (
              <div className="text-cyan-400 font-semibold">Memuat notifikasi...</div>
            ) : notif.length === 0 ? (
              <div className="text-gray-400 font-semibold">Belum ada notifikasi.</div>
            ) : (
              notif.map((n, idx) => (
                <div key={n.id || idx} className={`rounded-lg p-3 flex flex-col gap-1 shadow-sm border-l-4 ${darkMode ? 'bg-gray-900/80 border-cyan-700' : 'bg-white border-cyan-400'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>{n.namaBarang || n.title || '-'}</span>
                    {n.status && (
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${n.status === 'Disetujui' ? (darkMode ? 'bg-cyan-800 text-cyan-100' : 'bg-cyan-200 text-cyan-800') : n.status === 'Menunggu' ? (darkMode ? 'bg-yellow-700 text-yellow-200' : 'bg-yellow-200 text-yellow-800') : (darkMode ? 'bg-red-800 text-red-200' : 'bg-red-200 text-red-800')}`}>{n.status}</span>
                    )}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-cyan-100' : 'text-cyan-800'}`}>{n.message || n.pesan || '-'}</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.tanggal ? new Date(n.tanggal).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Fitur info cepat & tips */}
        <section className="max-w-4xl mx-auto mb-10">
          <div className={`rounded-xl p-5 flex items-center gap-4 shadow bg-gradient-to-r ${darkMode ? 'from-cyan-950 via-emerald-950 to-cyan-900' : 'from-cyan-50 via-emerald-50 to-white'}`}>
            <FaInfoCircle className={`text-3xl ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
            <div>
              <div className="font-bold text-lg mb-1">Tips Penggunaan:</div>
              <ul className="list-disc ml-5 text-sm">
                <li>Gunakan menu <b>Riwayat</b> untuk melihat status pengajuan Anda.</li>
                <li>Pastikan data profil Anda sudah benar agar proses peminjaman lancar.</li>
                <li>Hubungi admin jika ada kendala melalui tombol WhatsApp di atas.</li>
                <li>Barang yang tersedia adalah barang yang belum dipinjam user lain.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Navigasi cepat */}
        <section className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <Link href="/dashboard/warga/riwayat" className={`rounded-xl p-6 flex items-center gap-4 shadow-lg bg-gradient-to-br ${darkMode ? 'from-cyan-900 via-emerald-900 to-cyan-950' : 'from-cyan-50 via-emerald-50 to-white'} hover:scale-105 transition`}>
            <FaHistory className={`text-3xl ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`} />
            <div>
              <div className="font-bold text-lg">Riwayat Peminjaman</div>
              <div className="text-sm">Lihat semua riwayat peminjaman Anda.</div>
            </div>
          </Link>
          <Link href="/dashboard/warga/notifikasi" className={`rounded-xl p-6 flex items-center gap-4 shadow-lg bg-gradient-to-br ${darkMode ? 'from-emerald-900 via-cyan-900 to-emerald-950' : 'from-emerald-50 via-cyan-50 to-white'} hover:scale-105 transition`}>
            <FaClipboardList className={`text-3xl ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`} />
            <div>
              <div className="font-bold text-lg">Notifikasi</div>
              <div className="text-sm">Cek notifikasi terbaru terkait peminjaman.</div>
            </div>
          </Link>
        </section>
        {/* ...existing code... */}
      </main>
    </>
  );
}