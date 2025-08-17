"use client";
import { useState } from "react";
import NavbarWarga from "../navbarwrg";
import { FaChair, FaBuilding, FaMicrophone, FaUtensils, FaPlusCircle, FaTableTennis } from "react-icons/fa";
import { GiShuttlecock } from "react-icons/gi";

// Format harga ke RpXXX.XXX (selalu pakai titik)
function formatRupiah(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


import { useEffect } from "react";

// Helper untuk pilih icon sesuai nama/tipe
function getIcon(nama: string) {
  const lower = nama?.toLowerCase?.() || "";
  if (lower.includes("badminton")) return <GiShuttlecock />;
  if (lower.includes("kursi")) return <FaChair />;
  if (lower.includes("aula")) return <FaBuilding />;
  if (lower.includes("sound")) return <FaMicrophone />;
  if (lower.includes("tenda")) return <FaBuilding />;
  if (lower.includes("dapur")) return <FaUtensils />;
  if (lower.includes("tenis")) return <FaTableTennis />;
  return <FaBuilding />;
}

// Helper untuk menentukan tipe berdasarkan harga
function getTipeFasilitas(item: any) {
  if (typeof item?.harga === 'number' && item.harga > 0) return 'sewa';
  return 'gratis';
}

// State barangList diisi dari Firestore

export default function AjukanPinjamPage() {
  const [barangList, setBarangList] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<any>(null);
  const [form, setForm] = useState({
    nama: "",
    nik: "",
    alamat: "",
    tanggalPinjam: "",
    tanggalKembali: "",
    jumlah: "1",
    keterangan: "",
  });
  const [step, setStep] = useState<"form" | "payment" | "token" | "success">("form");
  const [notif, setNotif] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // default dark
  const [paymentMethod, setPaymentMethod] = useState<"cod" | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);

  // Data peminjaman disetujui
  const [peminjamanAktif, setPeminjamanAktif] = useState<any[]>([]);

  // Ambil data fasilitas dan peminjaman disetujui dari Firestore
  const [loadingFasilitas, setLoadingFasilitas] = useState(true);
  useEffect(() => {
    const fetchFasilitasDanPeminjaman = async () => {
      setLoadingFasilitas(true);
      try {
        const [resFasilitas, resPeminjaman] = await Promise.all([
          fetch("/api/fasilitas"),
          fetch("/api/peminjaman")
        ]);
        const jsonFasilitas = await resFasilitas.json();
        const jsonPeminjaman = await resPeminjaman.json();
        if (jsonFasilitas.success && Array.isArray(jsonFasilitas.data)) {
          setBarangList(jsonFasilitas.data);
        } else {
          setBarangList([]);
        }
        // Filter hanya peminjaman yang statusnya Disetujui
        if (jsonPeminjaman.success && Array.isArray(jsonPeminjaman.data)) {
          setPeminjamanAktif(jsonPeminjaman.data.filter((p: any) => (p.status || "").toLowerCase() === "disetujui"));
        } else {
          setPeminjamanAktif([]);
        }
      } catch (err) {
        setBarangList([]);
        setPeminjamanAktif([]);
      }
      setLoadingFasilitas(false);
    };
    fetchFasilitasDanPeminjaman();
  }, []);

  // Open modal
  const handleAjukan = (barang: any) => {
    setSelectedBarang(barang);
    setForm({ nama: "", nik: "", alamat: "", tanggalPinjam: "", tanggalKembali: "", jumlah: "1", keterangan: "" });
    setStep("form");
    setModalOpen(true);
  };

  // Hitung jumlah tersedia: jumlahTotal - jumlahDipinjam
  const jumlahTersedia = selectedBarang ?
    Math.max(0, (typeof selectedBarang.jumlahTotal === 'number' ? selectedBarang.jumlahTotal : 0) - (typeof selectedBarang.jumlahDipinjam === 'number' ? selectedBarang.jumlahDipinjam : 0)) : 0;

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "nik") {
      // Hanya izinkan angka
      const onlyDigits = value.replace(/\D/g, "");
      setForm({ ...form, nik: onlyDigits });
    } else if (["nama", "alamat", "keterangan"].includes(name)) {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Validasi
  const isValid = () => {
    return (
      form.nama.trim() &&
      form.nik.trim().length === 16 &&
      /^\d{16}$/.test(form.nik.trim()) &&
      form.alamat.trim() &&
      form.tanggalPinjam &&
      form.tanggalKembali &&
      Number(form.jumlah) > 0 &&
      new Date(form.tanggalPinjam) <= new Date(form.tanggalKembali)
      // keterangan tidak wajib
    );
  };


  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return alert("Lengkapi data dengan benar!");
    // Ambil uid dari localStorage
    let uid = "";
    if (typeof window !== "undefined") {
      uid = localStorage.getItem("uid") || "";
    }
    // Data yang akan dikirim ke backend
    const payload = {
      barangId: selectedBarang.id || "",
      namaBarang: selectedBarang.nama || "",
      userId: uid, // gunakan UID sebagai userId
      nama: form.nama || "", // nama lengkap peminjam
      nik: form.nik || "",
      alamat: form.alamat || "",
      jumlah: Number(form.jumlah),
      status: "Menunggu",
      catatan: form.keterangan,
      tanggalPinjam: form.tanggalPinjam,
      tanggalKembali: form.tanggalKembali,
      keterangan: form.keterangan,
      // Bisa tambahkan field lain jika perlu
    };
    if (selectedBarang.tipe === "sewa") {
      setStep("payment");
    } else {
      setLoading(true);
      try {
        const res = await fetch("/api/peminjaman", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setNotif([
            ...notif,
            {
              ...form,
              barang: selectedBarang.nama,
              status: "Menunggu Konfirmasi Admin",
              tipe: selectedBarang.tipe,
              harga: selectedBarang.harga,
              waktu: new Date().toLocaleString(),
            },
          ]);
          setStep("success");
        } else {
          const err = await res.json();
          alert(err.error || "Gagal mengajukan peminjaman");
        }
      } catch (err) {
        alert("Gagal mengajukan peminjaman");
      }
      setLoading(false);
    }
  };

  // Pilih metode pembayaran
  const handleChoosePayment = async (method: "cod") => {
    setPaymentMethod(method);
    setLoading(true);
    // Simulasi generate token/struk
    const kode = `FSD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*10000)}`;
    const data = {
      ...form,
      barang: selectedBarang.nama,
      harga: selectedBarang.harga,
      metode: method,
      kode,
      waktu: new Date().toLocaleString(),
    };
    // Ambil uid dari localStorage
    let uid = "";
    if (typeof window !== "undefined") {
      uid = localStorage.getItem("uid") || "";
    }
    // Kirim ke backend
    const payload = {
      barangId: selectedBarang.id || "",
      namaBarang: selectedBarang.nama || "",
      userId: uid, // gunakan UID sebagai userId
      nama: form.nama || "", // nama lengkap peminjam
      nik: form.nik || "",
      alamat: form.alamat || "",
      jumlah: Number(form.jumlah),
      status: "Menunggu",
      catatan: form.keterangan,
      tanggalPinjam: form.tanggalPinjam,
      tanggalKembali: form.tanggalKembali,
      keterangan: form.keterangan,
      kodeToken: kode,
      metode: method,
    };
    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setTokenData(data);
        setNotif([
          ...notif,
          {
            ...data,
            status: "Menunggu Pembayaran di Loket",
            tipe: selectedBarang.tipe,
          },
        ]);
        setStep("token");
      } else {
        const err = await res.json();
        alert(err.error || "Gagal mengajukan peminjaman");
      }
    } catch (err) {
      alert("Gagal mengajukan peminjaman");
    }
    setLoading(false);
  };

  // Download token/struk
  const handleDownloadToken = () => {
    if (!tokenData) return;
    const text = `--- Bukti Pengajuan Peminjaman/Sewa Fasilitas ---\n\n` +
      `Nama: ${tokenData.nama}\nNIK: ${tokenData.nik}\nBarang: ${tokenData.barang}\nTanggal Pinjam: ${tokenData.tanggalPinjam}\nTanggal Kembali: ${tokenData.tanggalKembali}\nAlamat: ${tokenData.alamat}\nMetode: Bayar di Loket (COD)\nNominal: Rp${formatRupiah(tokenData.harga)}\nKode Token: ${tokenData.kode}\nWaktu Pengajuan: ${tokenData.waktu}\n\nTunjukkan kode token ini ke petugas pelayanan untuk pembayaran dan konfirmasi.`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bukti_Pengajuan_${tokenData.kode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedBarang(null);
    setForm({ nama: "", nik: "", alamat: "", tanggalPinjam: "", tanggalKembali: "", jumlah: "1", keterangan: "" });
    setStep("form");
  };

  return (
    <>
      <NavbarWarga darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className={`min-h-screen p-2 sm:p-4 md:p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-emerald-900'}`}> 
        <div className="flex justify-start mb-2">
          <a
            href="/dashboard/warga"
            className={`px-3 py-1.5 rounded-lg shadow-sm font-semibold flex items-center gap-1 transition text-xs sm:text-sm border
              ${darkMode ? 'bg-cyan-900 border-cyan-800 text-cyan-200 hover:bg-cyan-800' : 'bg-cyan-100 border-cyan-300 text-cyan-800 hover:bg-cyan-200'}`}
            style={{ minWidth: 'unset' }}
          >
            &larr; Dashboard
          </a>
        </div>
        <header className="mb-6 flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4">
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-cyan-900'}`}>Ajukan Peminjaman/Sewa Fasilitas</h1>
        </header>
        <section className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-10 min-h-[120px]">
          {loadingFasilitas ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <span className="spinner-border w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>
              <span className={`${darkMode ? 'text-cyan-200' : 'text-cyan-700'} font-semibold`}>Memuat fasilitas...</span>
            </div>
          ) : (
            <>
              {barangList.length === 0 && (
                <div className="col-span-full text-center text-gray-400">Tidak ada fasilitas tersedia.</div>
              )}
              {barangList.map((barang: any) => {
                const tipe = getTipeFasilitas(barang);
                // Hitung jumlah barang yang sedang dipakai hari ini
                const today = new Date();
                let jumlahDipakaiHariIni = 0;
                peminjamanAktif.forEach((p) => {
                  const idMatch = (p.barangId && barang.id && p.barangId === barang.id) || (p.namaBarang && barang.nama && p.namaBarang === barang.nama);
                  if (!idMatch) return;
                  let tglPinjam = p.tanggalPinjam;
                  let tglKembali = p.tanggalKembali;
                  if (tglPinjam && tglPinjam.seconds) tglPinjam = new Date(tglPinjam.seconds * 1000);
                  else if (typeof tglPinjam === "string") tglPinjam = new Date(tglPinjam);
                  if (tglKembali && tglKembali.seconds) tglKembali = new Date(tglKembali.seconds * 1000);
                  else if (typeof tglKembali === "string") tglKembali = new Date(tglKembali);
                  if (tglPinjam && tglKembali && tglPinjam <= today && today <= tglKembali) {
                    jumlahDipakaiHariIni += Number(p.jumlah) || 1;
                  }
                });
                const jumlahTersediaHariIni = (barang.jumlahTotal || 0) - jumlahDipakaiHariIni;
                return (
                  <div key={barang.id || barang.nama} className={`rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-6 flex flex-col items-center border-l-8
                    ${darkMode
                      ? `${tipe === 'sewa' ? 'border-cyan-600' : 'border-emerald-700'} bg-gray-800/90 backdrop-blur-md border-gray-700`
                      : `${tipe === 'sewa' ? 'border-cyan-400' : 'border-emerald-400'} bg-white`}
                  `}>
                    <div className={`text-2xl sm:text-4xl mb-1 sm:mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{getIcon(barang.nama)}</div>
                    <div className={`font-bold text-xs sm:text-lg mb-0.5 sm:mb-1 ${darkMode ? 'text-gray-100' : 'text-cyan-900'}`}>{barang.nama}</div>
                    <div className={`mb-1 sm:mb-2 text-[11px] sm:text-sm font-semibold ${tipe === "sewa" ? (darkMode ? 'text-cyan-300' : 'text-cyan-600') : (darkMode ? 'text-emerald-300' : 'text-emerald-600')}`}>
                      {tipe === "sewa" ? `Sewa - Rp${formatRupiah(barang.harga)}` : "Gratis"}
                    </div>
                    {barang.deskripsi && (
                      <div className={`text-[10px] sm:text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{barang.deskripsi}</div>
                    )}
                    {jumlahTersediaHariIni === 0 && (
                      <div className={`text-xs font-bold mb-1 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>Dipakai hari ini, silakan booking untuk besok</div>
                    )}
                    <button onClick={() => handleAjukan({ ...barang, tipe })} className={`mt-1 sm:mt-2 px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold shadow flex items-center gap-2 transition text-xs sm:text-base
                      ${darkMode ? 'bg-gradient-to-r from-cyan-700 to-emerald-700 text-white hover:from-cyan-600 hover:to-emerald-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                      disabled={jumlahTersediaHariIni === 0}
                    >
                      <FaPlusCircle /> Ajukan
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </section>
        {/* Modal */}
        {modalOpen && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-black/80' : 'bg-black/40'}`}>
            <div className={`rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md relative
              ${darkMode ? 'bg-gray-800/95 text-gray-100 border border-gray-700' : 'bg-white text-cyan-900'}`}
            >
              <button onClick={closeModal} className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-lg sm:text-xl font-bold ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}>&times;</button>
              {step === "form" && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-4">
                  <h2 className={`text-base sm:text-xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>{selectedBarang.nama} ({getTipeFasilitas(selectedBarang) === "sewa" ? `Sewa - Rp${formatRupiah(selectedBarang.harga)}` : "Gratis"})</h2>
                  {selectedBarang.deskripsi && (
                    <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedBarang.deskripsi}</div>
                  )}
                  <input
                    name="nama"
                    type="text"
                    placeholder="Nama Lengkap"
                    value={form.nama}
                    onChange={handleChange}
                    className={`px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'} uppercase`}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  <input
                    name="nik"
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    placeholder="NIK (16 digit)"
                    value={form.nik}
                    onChange={handleChange}
                    className={`px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`}
                    required
                    maxLength={16}
                    minLength={16}
                  />
                  <textarea
                    name="alamat"
                    placeholder="Alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    className={`px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'} uppercase`}
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  <textarea
                    name="keterangan"
                    placeholder="Keterangan (opsional, contoh: untuk acara, keperluan, dsb)"
                    value={form.keterangan}
                    onChange={handleChange}
                    className={`px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'} uppercase`}
                    style={{ textTransform: 'uppercase' }}
                    rows={2}
                  />
                  <div className="flex flex-col gap-1">
                    <input
                      name="jumlah"
                      type="number"
                      min="1"
                      max={jumlahTersedia}
                      placeholder="Jumlah dipinjam"
                      value={form.jumlah}
                      onChange={handleChange}
                      className={`px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`}
                      required
                      disabled={jumlahTersedia === 0}
                    />
                    <span className={`text-xs ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Tersedia: <b>{jumlahTersedia}</b> {selectedBarang?.satuan || ''}</span>
                    {jumlahTersedia === 0 && <span className={`text-xs text-red-500`}>Stok habis, tidak bisa diajukan</span>}
                  </div>
                  <div className="flex gap-2">
                    <input name="tanggalPinjam" type="date" value={form.tanggalPinjam} onChange={handleChange} className={`px-3 sm:px-4 py-2 rounded-lg border w-1/2 focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} required />
                    <input name="tanggalKembali" type="date" value={form.tanggalKembali} onChange={handleChange} className={`px-3 sm:px-4 py-2 rounded-lg border w-1/2 focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-gray-100 focus:ring-cyan-700 placeholder-gray-400' : 'border-cyan-300 focus:ring-cyan-400'}`} required />
                  </div>
                  <button type="submit" className={`mt-1 sm:mt-2 px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold shadow transition text-xs sm:text-base
                    ${darkMode ? 'bg-gradient-to-r from-cyan-700 to-emerald-700 text-white hover:from-cyan-600 hover:to-emerald-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                    disabled={loading}
                  >
                    {loading && <span className="spinner-border w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>}
                    {getTipeFasilitas(selectedBarang) === "sewa" ? "Lanjut ke Pembayaran" : "Ajukan Peminjaman"}
                  </button>
                </form>
              )}
              {step === "payment" && (
                <div className="flex flex-col gap-2 sm:gap-4">
                  <h2 className={`text-base sm:text-xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>Pilih Metode Pembayaran</h2>
                  <div className="mb-1 sm:mb-2">Total: <span className={`font-bold ${darkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>Rp{formatRupiah(selectedBarang.harga)}</span></div>
                  <button
                    onClick={() => handleChoosePayment("cod")}
                    className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold shadow transition text-xs sm:text-base mb-2
                      ${darkMode ? 'bg-gradient-to-r from-cyan-700 to-emerald-700 text-white hover:from-cyan-600 hover:to-emerald-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                    disabled={loading}
                  >
                    {loading && paymentMethod === "cod" && <span className="spinner-border w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></span>}
                    Bayar di Loket (COD)
                  </button>
                  <div className={`text-xs sm:text-sm ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>Pilih "Bayar di Loket (COD)" untuk membayar langsung di kantor desa saat pengambilan fasilitas.</div>
                  {loading && <div className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>Menyiapkan token pembayaran...</div>}
                </div>
              )}

              {step === "token" && tokenData && (
                <div className="flex flex-col gap-2 sm:gap-4 items-center">
                  <h2 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>Bukti Pengajuan & Token Pembayaran</h2>
                  <div className={`rounded-lg border p-3 text-xs sm:text-base w-full ${darkMode ? 'bg-gray-900 border-cyan-800 text-cyan-100' : 'bg-cyan-50 border-cyan-300 text-cyan-900'}`}>
                    <div><b>Nama:</b> {tokenData.nama}</div>
                    <div><b>NIK:</b> {tokenData.nik}</div>
                    <div><b>Barang:</b> {tokenData.barang}</div>
                    <div><b>Tanggal Pinjam:</b> {tokenData.tanggalPinjam}</div>
                    <div><b>Tanggal Kembali:</b> {tokenData.tanggalKembali}</div>
                    <div><b>Alamat:</b> {tokenData.alamat}</div>
                    <div><b>Metode:</b> Bayar di Loket (COD)</div>
                    <div><b>Nominal:</b> Rp{formatRupiah(tokenData.harga)}</div>
                    <div><b>Kode Token:</b> <span className="font-mono text-base sm:text-lg text-cyan-500">{tokenData.kode}</span></div>
                    <div><b>Waktu Pengajuan:</b> {tokenData.waktu}</div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleDownloadToken} className={`px-3 py-1.5 rounded-lg font-bold shadow text-xs sm:text-base
                      ${darkMode ? 'bg-cyan-700 text-white hover:bg-cyan-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                    >Download Bukti</button>
                    <button onClick={closeModal} className={`px-3 py-1.5 rounded-lg font-bold shadow text-xs sm:text-base
                      ${darkMode ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >Tutup</button>
                  </div>
                  <div className={`text-xs sm:text-sm mt-2 text-center ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>Tunjukkan kode token ini ke petugas pelayanan untuk pembayaran dan konfirmasi pengambilan fasilitas.</div>
                </div>
              )}
              {step === "success" && (
                <div className="flex flex-col gap-3 sm:gap-4 items-center">
                  <h2 className={`text-base sm:text-xl font-bold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>Pengajuan Berhasil!</h2>
                  <div className={`text-center text-xs sm:text-base ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>Pengajuan Anda sedang menunggu konfirmasi admin.<br />Status dapat dicek di halaman notifikasi.</div>
                  <button onClick={closeModal} className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl font-bold shadow transition text-xs sm:text-base
                    ${darkMode ? 'bg-gradient-to-r from-emerald-700 to-cyan-700 text-white hover:from-emerald-800 hover:to-cyan-800' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                  >Tutup</button>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Notifikasi Pengajuan */}
        <section className="mt-6 sm:mt-10">
          <h2 className={`text-lg sm:text-xl font-bold mb-2 sm:mb-4 ${darkMode ? 'text-emerald-200' : 'text-cyan-900'}`}>Notifikasi Pengajuan</h2>
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-4">
            {notif.length === 0 && <div className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Belum ada pengajuan.</div>}
            {notif.map((n, i) => (
              <div key={i} className={`rounded-lg sm:rounded-xl shadow p-3 sm:p-4 border-l-4
                ${darkMode ? 'bg-gray-800/90 border-cyan-700 text-gray-100' : 'bg-white border-cyan-400'}`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`font-bold ${darkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>{n.barang}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${getTipeFasilitas(n) === 'sewa' ? (darkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-100 text-cyan-700') : (darkMode ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700')}`}>{getTipeFasilitas(n) === 'sewa' ? 'Sewa' : 'Gratis'}</span>
                  {n.harga != null && getTipeFasilitas(n) === 'sewa' && (
                    <span className={`text-xs font-semibold ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Rp{formatRupiah(n.harga)}</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm mb-0.5">
                  <b>Peminjam:</b> {n.nama} ({n.nik})
                </div>
                <div className="text-xs sm:text-sm mb-0.5">
                  <b>Jumlah dipinjam:</b> {n.jumlah || '-'}
                </div>
                <div className="text-xs sm:text-sm mb-0.5">
                  <b>Alamat:</b> {n.alamat}
                </div>
                <div className="text-xs sm:text-sm mb-0.5">
                  <b>Pinjam:</b> {n.tanggalPinjam} &rarr; {n.tanggalKembali}
                </div>
                {n.kode && (
                  <div className="text-xs sm:text-sm mb-0.5">
                    <b>Kode Token:</b> <span className="font-mono text-base sm:text-lg text-cyan-500">{n.kode}</span>
                  </div>
                )}
                {n.metode && (
                  <div className="text-xs sm:text-sm mb-0.5">
                    <b>Metode:</b> {n.metode === 'cod' ? 'Bayar di Loket (COD)' : n.metode}
                  </div>
                )}
                {n.harga != null && n.tipe === 'sewa' && (
                  <div className="text-xs sm:text-sm mb-0.5">
                    <b>Nominal:</b> Rp{formatRupiah(n.harga)}
                  </div>
                )}
                <div className={`text-[10px] sm:text-xs mb-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.waktu}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-bold text-xs sm:text-sm px-2 py-0.5 rounded ${n.status?.toLowerCase().includes('menunggu') ? (darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700') : n.status?.toLowerCase().includes('berhasil') ? (darkMode ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700') : (darkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-100 text-cyan-700')}`}>{n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Spinner loading style */}
        <style jsx global>{`
          .spinner-border {
            display: inline-block;
            border-style: solid;
            border-radius: 50%;
            border-right-color: transparent;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    </>
  );
}
