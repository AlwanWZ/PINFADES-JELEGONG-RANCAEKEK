
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
  // Dark mode state
  const [darkMode, setDarkMode] = useState(true);

  // Loading and error state for pembayaran
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pembayaran data
  const [pembayaran, setPembayaran] = useState<PembayaranItem[]>([]);

  // Rekap bulanan
  const [rekap, setRekap] = useState<Record<string, number>>({});

  // Fetch pembayaran data (dummy fetch, replace with real API if needed)
  useEffect(() => {
    async function fetchPembayaran() {
      setLoading(true);
      setError("");
      try {
        // Example: fetch from /api/pembayaran
        const res = await fetch("/api/pembayaran");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setPembayaran(json.data);
          // Rekap bulanan
          const rekapObj: Record<string, number> = {};
          json.data.forEach((item: PembayaranItem) => {
            if (item.tanggalBayar) {
              const bulan = new Date(item.tanggalBayar).toLocaleString("id-ID", { month: "long", year: "numeric" });
              rekapObj[bulan] = (rekapObj[bulan] || 0) + item.harga;
            }
          });
          setRekap(rekapObj);
        } else {
          setPembayaran([]);
          setRekap({});
        }
      } catch (err: any) {
        setError("Gagal memuat data pembayaran");
        setPembayaran([]);
        setRekap({});
      }
      setLoading(false);
    }
    fetchPembayaran();
  }, []);

  function formatRupiah(num: number) {
    return num.toLocaleString("id-ID");
  }

  return (
    <>
      <NavbarAdmin darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-0 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}>
        <section className="rounded-2xl shadow-xl p-6 mb-10 bg-white/80 dark:bg-gray-800/90 flex items-center justify-center min-h-[120px]">
          <div className="text-center w-full">
            <h2 className="text-lg font-bold mb-4">Transaksi</h2>
            <div className={`text-2xl font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Coming Soon / Dalam Tahap Pengembangan</div>
            <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fitur input transaksi manual oleh admin akan segera hadir.</div>
          </div>
        </section>
  {/* Riwayat Pembayaran & Rekap Bulanan sections removed as requested */}
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
