"use client";


import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
// ...existing code...
import NavbarAdmin from "../navbaradm";
import Link from "next/link";
import { FaChair, FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";


export default function FasilitasAdminPage() {
  // All hooks must be called unconditionally and in the same order
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // default dark
  interface FasilitasItem {
    id: string;
    nama: string;
    jumlahTotal: number;
    jumlahDipinjam: number;
    tipe?: string;
    lokasi?: string;
    status?: string;
    deskripsi?: string;
    harga?: number;
    satuan?: string;
    kodeBarang?: string;
    createdAt?: string;
  }
  interface FormState {
    id: string | null;
    nama: string;
    jumlahTotal: string;
    jumlahDipinjam: string;
    tipe: string;
    lokasi: string;
    status: string;
    deskripsi: string;
    harga: string;
    satuan: string;
    kodeBarang: string;
  }
  const [fasilitas, setFasilitas] = useState<FasilitasItem[]>([]);
  const [form, setForm] = useState<FormState>({
    id: null,
    nama: "",
    jumlahTotal: "",
    jumlahDipinjam: "0",
    tipe: "",
    lokasi: "",
    status: "",
    deskripsi: "",
    harga: "",
    satuan: "",
    kodeBarang: ""
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        // Fetch fasilitas setelah lolos autentikasi
        fetchFasilitas();
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

  async function fetchFasilitas() {
    setLoading(true);
    try {
      const res = await fetch("/api/fasilitas");
      const data = await res.json();
      if (data.success) setFasilitas(data.data);
      else setError(data.error || "Gagal mengambil data fasilitas");
    } catch (e) {
      setError("Gagal mengambil data fasilitas");
    }
    setLoading(false);
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update fasilitas
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editId) {
        // Update
        const res = await fetch(`/api/fasilitas/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            jumlahTotal: parseInt(form.jumlahTotal),
            jumlahDipinjam: parseInt(form.jumlahDipinjam),
            harga: form.harga ? parseInt(form.harga) : undefined
          })
        });
        const data = await res.json();
        if (!data.success) setError(data.error || "Gagal update fasilitas");
      } else {
        // Create
        const res = await fetch("/api/fasilitas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: form.nama,
            tipe: form.tipe,
            lokasi: form.lokasi,
            status: form.status,
            deskripsi: form.deskripsi,
            harga: form.harga ? parseInt(form.harga) : undefined,
            satuan: form.satuan,
            kodeBarang: form.kodeBarang,
            jumlahTotal: parseInt(form.jumlahTotal),
            jumlahDipinjam: parseInt(form.jumlahDipinjam)
          })
        });
        const data = await res.json();
        if (!data.success) setError(data.error || "Gagal tambah fasilitas");
      }
      setForm({
        id: null,
        nama: "",
        jumlahTotal: "",
        jumlahDipinjam: "0",
        tipe: "",
        lokasi: "",
        status: "",
        deskripsi: "",
        harga: "",
        satuan: "",
        kodeBarang: ""
      });
      setEditId(null);
      fetchFasilitas();
    } catch (e) {
      setError("Gagal simpan data fasilitas");
    }
    setLoading(false);
  };

  // Edit fasilitas
  const handleEdit = (item: FasilitasItem): void => {
    setEditId(item.id);
    setForm({
      id: item.id,
      nama: item.nama || "",
      jumlahTotal: item.jumlahTotal?.toString() || "",
      jumlahDipinjam: item.jumlahDipinjam?.toString() || "0",
      tipe: item.tipe || "",
      lokasi: item.lokasi || "",
      status: item.status || "",
      deskripsi: item.deskripsi || "",
      harga: item.harga?.toString() || "",
      satuan: item.satuan || "",
      kodeBarang: item.kodeBarang || ""
    });
  };

  // Delete fasilitas
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/fasilitas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) setError(data.error || "Gagal hapus fasilitas");
      fetchFasilitas();
    } catch (e) {
      setError("Gagal hapus fasilitas");
    }
    setLoading(false);
  };

  return (
    <>
      <NavbarAdmin darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-0 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}>
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-cyan-900'}`}>Kelola Fasilitas</h1>
          <Link href="/dashboard/admin" className={`hover:underline font-bold ${darkMode ? 'text-emerald-200' : 'text-cyan-700'}`}>Kembali ke Dashboard</Link>
        </header>
        <section className={`rounded-2xl shadow-xl p-6 mb-10 ${darkMode ? 'bg-gray-800/90' : 'bg-white'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="loader-spinner mb-4" />
              <span className="text-lg font-semibold text-cyan-400">Memuat data fasilitas...</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-6 flex-wrap">
                <input type="text" name="nama" placeholder="Nama Fasilitas" value={form.nama} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} required />
                <input type="text" name="tipe" placeholder="Tipe" value={form.tipe} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} />
                <input type="text" name="lokasi" placeholder="Lokasi" value={form.lokasi} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} />
                <select name="status" value={form.status} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700' : 'border-cyan-300 focus:ring-cyan-400'}`} required>
                  <option value="">Pilih Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
                <input type="text" name="deskripsi" placeholder="Deskripsi" value={form.deskripsi} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} />
                <input type="number" name="harga" placeholder="Harga (isi jika sewa, kosong = gratis)" value={form.harga} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} min={0} />
                <input type="text" name="kodeBarang" placeholder="Kode Barang" value={form.kodeBarang} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} />
                <input type="number" name="jumlahTotal" placeholder="Jumlah Total" value={form.jumlahTotal} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} required min={1} />
                <input type="number" name="jumlahDipinjam" placeholder="Jumlah Dipinjam" value={form.jumlahDipinjam} onChange={handleChange} className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-cyan-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} min={0} />
                <button type="submit" className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition shadow ${darkMode ? 'bg-cyan-700 text-white hover:bg-cyan-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>{editId ? <FaEdit /> : <FaPlusCircle />} {editId ? "Update" : "Tambah"}</button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm({ id: null, nama: "", jumlahTotal: "", jumlahDipinjam: "0", tipe: "", lokasi: "", status: "", deskripsi: "", harga: "", satuan: "", kodeBarang: "" }); }} className={`px-4 py-2 rounded-xl font-bold transition shadow ${darkMode ? 'bg-gray-700 text-cyan-200 hover:bg-gray-600' : 'bg-gray-200 text-cyan-700 hover:bg-gray-300'}`}>Batal</button>
                )}
              </form>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm">
                  <thead>
                    <tr className={`${darkMode ? 'bg-cyan-900 text-white' : 'bg-cyan-100 text-cyan-900'} font-bold text-center`}>
                      <th className="py-2 px-4">Nama</th>
                      <th className="py-2 px-4">Tipe</th>
                      <th className="py-2 px-4">Lokasi</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 px-4">Harga</th>
                      <th className="py-2 px-4">Kode</th>
                      <th className="py-2 px-4">Deskripsi</th>
                      <th className="py-2 px-4">Jumlah</th>
                      <th className="py-2 px-4">Waktu Input</th>
                      <th className="py-2 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fasilitas.map((item) => (
                      <tr key={item.id} className={`${darkMode ? 'border-b border-cyan-800 hover:bg-cyan-950' : 'border-b hover:bg-white hover:shadow-md transition'} text-center`}>
                        <td className={`py-2 px-4 font-semibold ${darkMode ? 'text-cyan-200' : 'text-cyan-700 bg-cyan-50/80'}`}>{item.nama}</td>
                        <td className="py-2 px-4">{item.tipe || '-'}</td>
                        <td className="py-2 px-4">{item.lokasi || '-'}</td>
                        <td className="py-2 px-4">{item.status || '-'}</td>
                        <td className="py-2 px-4">{item.harga != null && item.harga !== undefined && item.harga !== 0 ? `Rp${item.harga.toLocaleString()}` : <span className="font-bold text-green-500">Gratis</span>}</td>
                        <td className="py-2 px-4">{item.kodeBarang || '-'}</td>
                        <td className="py-2 px-4 text-left max-w-[180px] truncate" title={item.deskripsi}>{item.deskripsi || '-'}</td>
                        <td className="py-2 px-4 text-center">
                          <div>Total: {item.jumlahTotal?.toLocaleString?.() ?? '-'}</div>
                          <div>Dipinjam: {item.jumlahDipinjam?.toLocaleString?.() ?? '-'}</div>
                          <div className="font-bold text-green-500">Tersedia: {(item.jumlahTotal && item.jumlahDipinjam != null) ? (item.jumlahTotal - item.jumlahDipinjam).toLocaleString() : '-'}</div>
                        </td>
                        <td className="py-2 px-4 text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                        <td className="py-2 px-4 flex gap-2 justify-center">
                          <button className={`font-bold ${darkMode ? 'text-blue-400 hover:text-blue-200' : 'text-cyan-600 hover:text-cyan-800 bg-cyan-100 hover:bg-cyan-200 transition rounded p-1'}`} onClick={() => handleEdit(item)} title="Edit"><FaEdit /></button>
                          <button className={`font-bold ${darkMode ? 'text-red-400 hover:text-red-200' : 'text-red-500 hover:text-white bg-red-100 hover:bg-red-500 transition rounded p-1'}`} onClick={() => handleDelete(item.id)} title="Hapus"><FaTrash /></button>
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
