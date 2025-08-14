
"use client";
// ...existing code...
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarAdmin from "../navbaradm";
import Link from "next/link";

interface PembayaranItem {
  id: string;
  nama: string;
  nik?: string;
  barang: string;
  harga: number;
  tanggalBayar: string;
  metode: string;
  status: string;
}

export default function AdminTransaksiPage() {
  // All hooks must be called unconditionally and in the same order
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [pembayaran, setPembayaran] = useState<PembayaranItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rekap, setRekap] = useState<{ [bulan: string]: number }>({});
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
        // Fetch pembayaran setelah lolos autentikasi
        setLoading(true);
        try {
          const res = await fetch("/api/peminjaman");
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            const bayar = json.data.filter((item: any) => item.harga && (item.status === "Disetujui" || item.status === "Lunas"));
            setPembayaran(bayar.map((item: any) => ({
              id: item.id,
              nama: item.nama || item.namaPeminjam || "-",
              nik: item.nik,
              barang: item.namaBarang || item.barang || "-",
              harga: item.harga,
              tanggalBayar: item.tanggalBayar || item.tanggalPinjam || item.createdAt || "-",
              metode: item.metode || "COD",
              status: item.status,
            })));
            // Rekap pemasukan per bulan
            const rekapBaru: { [bulan: string]: number } = {};
            bayar.forEach((item: any) => {
              const tgl = item.tanggalBayar || item.tanggalPinjam || item.createdAt;
              if (tgl) {
                const d = new Date(tgl);
                const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;
                rekapBaru[key] = (rekapBaru[key] || 0) + (item.harga || 0);
              }
            });
            setRekap(rekapBaru);
          } else {
            setError("Gagal memuat data pembayaran");
          }
        } catch {
          setError("Gagal memuat data pembayaran");
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

  function formatRupiah(num: number) {
    return num.toLocaleString("id-ID");
  }

  return (
    <>
      <NavbarAdmin darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-0 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}>
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-cyan-900'}`}>Riwayat Pembayaran & Rekap Bulanan</h1>
          <Link href="/dashboard/admin" className={`hover:underline font-bold ${darkMode ? 'text-emerald-200' : 'text-cyan-700'}`}>Kembali ke Dashboard</Link>
        </header>
        <section className="rounded-2xl shadow-xl p-6 mb-10 bg-white/80 dark:bg-gray-800/90">
          <h2 className="text-lg font-bold mb-4">Riwayat Pembayaran Warga</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="loader-spinner mb-4" />
              <span className="text-lg font-semibold text-cyan-400">Memuat data pembayaran...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">{error}</div>
          ) : pembayaran.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Belum ada pembayaran.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm rounded-2xl shadow-lg overflow-hidden border border-cyan-100 dark:border-cyan-900">
                <thead>
                  <tr className={`${darkMode ? 'bg-cyan-900 text-white' : 'bg-cyan-100 text-cyan-900'} font-bold text-center`}>
                    <th className="py-2 px-4">Nama</th>
                    <th className="py-2 px-4">NIK</th>
                    <th className="py-2 px-4">Barang</th>
                    <th className="py-2 px-4">Harga</th>
                    <th className="py-2 px-4">Tanggal Bayar</th>
                    <th className="py-2 px-4">Metode</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pembayaran.map((item) => (
                    <tr key={item.id} className={`${darkMode ? 'border-b border-cyan-800 hover:bg-cyan-950' : 'border-b hover:bg-white hover:shadow-md transition'} text-center`}>
                      <td className="py-2 px-4">{item.nama}</td>
                      <td className="py-2 px-4">{item.nik || '-'}</td>
                      <td className="py-2 px-4">{item.barang}</td>
                      <td className="py-2 px-4">Rp{formatRupiah(item.harga)}</td>
                      <td className="py-2 px-4">{item.tanggalBayar ? new Date(item.tanggalBayar).toLocaleDateString("id-ID") : '-'}</td>
                      <td className="py-2 px-4">{item.metode}</td>
                      <td className="py-2 px-4">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="rounded-2xl shadow-xl p-6 mb-10 bg-white/80 dark:bg-gray-800/90">
          <h2 className="text-lg font-bold mb-4">Rekap Pemasukan Bulanan</h2>
          {Object.keys(rekap).length === 0 ? (
            <div className="text-center py-8 text-gray-400">Belum ada pemasukan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[400px] w-full text-sm rounded-2xl shadow-lg overflow-hidden border border-cyan-100 dark:border-cyan-900">
                <thead>
                  <tr className={`${darkMode ? 'bg-cyan-900 text-white' : 'bg-cyan-100 text-cyan-900'} font-bold text-center`}>
                    <th className="py-2 px-4">Bulan</th>
                    <th className="py-2 px-4">Total Pemasukan</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(rekap).sort((a,b) => b[0].localeCompare(a[0])).map(([bulan, total]) => (
                    <tr key={bulan} className={`${darkMode ? 'border-b border-cyan-800 hover:bg-cyan-950' : 'border-b hover:bg-white hover:shadow-md transition'} text-center`}>
                      <td className="py-2 px-4">{bulan}</td>
                      <td className="py-2 px-4 font-bold text-green-600 dark:text-green-300">Rp{formatRupiah(total)}</td>
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
        `}</style>
      </main>
    </>
  );
}
