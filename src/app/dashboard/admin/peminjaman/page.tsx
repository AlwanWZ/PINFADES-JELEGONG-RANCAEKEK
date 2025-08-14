
"use client";
// ...existing code...
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import NavbarAdmin from "../navbaradm";
import { useState, useEffect } from "react";
import { FaClipboardList, FaPlusCircle, FaTrash } from "react-icons/fa";
import Link from "next/link";
// Helper untuk kirim notifikasi ke warga
type NotifikasiPayload = {
  uid: string;
  type: string;
  title: string;
  message: string;
  barangId?: string;
  namaBarang?: string;
  peminjamanId?: string;
  adminId?: string;
};
async function sendNotifikasi({ uid, type, title, message, barangId, namaBarang, peminjamanId, adminId }: NotifikasiPayload) {
  try {
    await fetch("/api/notifikasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid, // HARUS UID
        type,
        title,
        message,
        status: title?.toLowerCase().includes("setuju") ? "Disetujui" : title?.toLowerCase().includes("tolak") ? "Ditolak" : "Menunggu",
        barangId,
        namaBarang,
        peminjamanId,
        adminId,
        tanggal: new Date().toISOString(),
        read: false,
        meta: {},
      }),
    });
  } catch (e) {}
}

interface PeminjamanItem {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  fasilitas: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  status: "Disetujui" | "Menunggu" | "Ditolak";
  uid?: string; // UID user peminjam
}


export default function AdminPeminjamanPage() {
  // All hooks must be called unconditionally and in the same order
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // default dark
  const [peminjaman, setPeminjaman] = useState<PeminjamanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null); // id baris yang sedang diproses
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
        // Fetch peminjaman setelah lolos autentikasi
        setLoading(true);
        try {
          const res = await fetch("/api/peminjaman");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setPeminjaman(json.data.map((item: any) => {
              let status = "Menunggu";
              if (typeof item.status === "string") {
                const s = item.status.toLowerCase();
                if (s === "disetujui") status = "Disetujui";
                else if (s === "ditolak") status = "Ditolak";
                else status = "Menunggu";
              }
              return {
                id: item.id || item.docId || "",
                nama: item.nama || item.namaLengkap || item.uid || "-",
                nik: item.nik || "-",
                alamat: item.alamat || "-",
                fasilitas: item.namaBarang || item.fasilitas || item.barang || "-",
                tanggalPinjam: item.tanggalPinjam && item.tanggalPinjam.seconds ?
                  new Date(item.tanggalPinjam.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) :
                  (item.tanggalPinjam ? item.tanggalPinjam : "-"),
                tanggalKembali: item.tanggalKembali && item.tanggalKembali.seconds ?
                  new Date(item.tanggalKembali.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) :
                  (item.tanggalKembali ? item.tanggalKembali : "-"),
                status,
                uid: item.uid || item.userId || "", // simpan UID user
              };
            }));
          } else {
            setPeminjaman([]);
          }
        } catch (err) {
          setPeminjaman([]);
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

  // Hapus peminjaman
  const handleDelete = async (id: string) => {
    setPeminjaman(peminjaman.filter((item) => item.id !== id));
    try {
      await fetch(`/api/peminjaman?id=${id}`, { method: "DELETE" });
    } catch (e) {}
  };

  // Setujui/Tolak peminjaman dan kirim notifikasi
  const handleStatus = async (id: string, status: "Disetujui" | "Ditolak") => {
    setProcessingId(id);
    // Optimis update status di UI langsung
    setPeminjaman(prev => prev.map(item =>
      item.id === id ? { ...item, status } : item
    ));
    // Temukan data peminjaman terkait
    const item = peminjaman.find(p => p.id === id);
    if (!item) {
      setProcessingId(null);
      return;
    }
    try {
      // Update status di backend
      await fetch(`/api/peminjaman`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      // Kirim notifikasi ke warga (userId HARUS UID, bukan NIK)
      let message = "";
      if (status === "Disetujui") {
        message = `Pengajuan peminjaman fasilitas ${item.fasilitas} telah disetujui. Silakan datang ke kantor desa untuk pengambilan barang.`;
        // Jika nama fasilitas mengandung kata 'sewa', tambahkan instruksi pembayaran COD
        if (item.fasilitas && /sewa/i.test(item.fasilitas)) {
          message += " Jika fasilitas ini disewa, silakan tunjukkan bukti peminjaman dan lakukan pembayaran di loket (COD).";
        }
      } else if (status === "Ditolak") {
        message = `Maaf, pengajuan peminjaman fasilitas ${item.fasilitas} ditolak. Silakan hubungi admin untuk info lebih lanjut atau ajukan ulang jika diperlukan.`;
      }
      await sendNotifikasi({
        uid: item.uid || item.nik || "", // gunakan UID, fallback ke NIK jika benar-benar tidak ada
        type: "peminjaman",
        title: status === "Disetujui" ? "Peminjaman Disetujui" : "Peminjaman Ditolak",
        message,
        barangId: "",
        namaBarang: item.fasilitas,
        peminjamanId: id,
        adminId: "",
      });
      setProcessingId(null);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      setProcessingId(null);
    }
  };

  return (
    <>
      <NavbarAdmin darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-0 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}>
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-3xl md:text-4xl font-extrabold ${darkMode ? 'text-white' : ''}`}>Kelola Peminjaman</h1>
          <Link href="/dashboard/admin" className={`hover:underline font-bold ${darkMode ? 'text-emerald-200' : 'text-cyan-700'}`}>Kembali ke Dashboard</Link>
        </header>
        <section className={`rounded-2xl shadow-xl p-6 mb-10 ${darkMode ? 'bg-gray-800/90' : 'bg-white'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="loader-spinner mb-4" />
              <span className="text-lg font-semibold text-cyan-400">Memuat data peminjaman...</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : ''}`}>Daftar Peminjaman</h2>
                <Link href="#" className={`flex items-center gap-2 hover:underline font-bold ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}><FaPlusCircle /> Tambah Peminjaman</Link>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead>
                    <tr className={`${darkMode ? 'bg-cyan-900 text-white' : 'bg-cyan-100 text-cyan-900'} font-bold text-center`}>
                      <th className="py-2 px-4 text-center">Nama</th>
                      <th className="py-2 px-4 text-center">NIK</th>
                      <th className="py-2 px-4 text-center">Alamat</th>
                      <th className="py-2 px-4 text-center">Fasilitas</th>
                      <th className="py-2 px-4 text-center">Tanggal Pinjam</th>
                      <th className="py-2 px-4 text-center">Tanggal Kembali</th>
                      <th className="py-2 px-4 text-center">Status</th>
                      <th className="py-2 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peminjaman
                      .filter(item => item.nama !== "-" && item.nik !== "-" && item.alamat !== "-" && item.fasilitas !== "-")
                      .map((item, idx) => (
                        <tr
                          key={item.id}
                          className={
                            `${darkMode
                              ? `border-b border-cyan-800 ${idx%2===0 ? 'bg-cyan-950/30' : ''} hover:bg-cyan-950/60 transition`
                              : `border-b border-cyan-100 ${idx%2===0 ? 'bg-cyan-50/60' : 'bg-white'} hover:bg-cyan-100/80 transition`} text-center`
                          }
                        >
                          <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.nama}</td>
                          <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.nik}</td>
                          <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.alamat}</td>
                          <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.fasilitas}</td>
                          <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.tanggalPinjam}</td>
                          <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-900'}`}>{item.tanggalKembali}</td>
                          <td className="py-3 px-4">
                            <span className={
                              item.status === "Disetujui"
                                ? darkMode
                                  ? 'bg-cyan-800 text-cyan-100 px-2 py-1 rounded font-bold'
                                  : 'bg-cyan-200 text-cyan-800 px-2 py-1 rounded font-bold'
                                : item.status === "Menunggu"
                                ? darkMode
                                  ? 'bg-yellow-700 text-yellow-200 px-2 py-1 rounded font-bold'
                                  : 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-bold'
                                : darkMode
                                ? 'bg-red-800 text-red-200 px-2 py-1 rounded font-bold'
                                : 'bg-red-200 text-red-800 px-2 py-1 rounded font-bold'
                            }>{item.status}</span>
                          </td>
                          <td className="py-3 px-4 flex flex-col md:flex-row gap-2 justify-center items-center">
                            {item.status === "Menunggu" ? (
                              <>
                                <button
                                  className={`px-3 py-1 rounded font-bold text-xs shadow transition ${darkMode ? 'bg-cyan-700 text-white hover:bg-cyan-800' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
                                  onClick={() => handleStatus(item.id, "Disetujui")}
                                  disabled={!!processingId}
                                >{processingId === item.id ? 'Memproses...' : 'Setujui'}</button>
                                <button
                                  className={`px-3 py-1 rounded font-bold text-xs shadow transition ${darkMode ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                  onClick={() => handleStatus(item.id, "Ditolak")}
                                  disabled={!!processingId}
                                >{processingId === item.id ? 'Memproses...' : 'Tolak'}</button>
                              </>
                            ) : (
                              <span className={
                                item.status === "Disetujui"
                                  ? darkMode
                                    ? 'bg-cyan-800 text-cyan-100 px-3 py-1 rounded font-bold'
                                    : 'bg-cyan-200 text-cyan-800 px-3 py-1 rounded font-bold'
                                  : 'bg-red-800 text-red-100 px-3 py-1 rounded font-bold'
                              }>
                                {item.status === "Disetujui" ? 'Sudah Disetujui' : 'Sudah Ditolak'}
                              </span>
                            )}
                            <button
                              className={`font-bold flex items-center justify-center w-8 h-8 ${darkMode ? 'text-red-300 hover:text-white bg-cyan-900 hover:bg-red-700' : 'text-red-500 hover:text-white bg-red-100 hover:bg-red-400'} transition rounded-full shadow-sm`}
                              onClick={() => handleDelete(item.id)}
                              title="Hapus"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
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
