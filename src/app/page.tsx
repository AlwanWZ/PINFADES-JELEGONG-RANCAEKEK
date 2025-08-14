"use client";
import { useState } from "react";
import { Moon, Sun, Menu, X, MapPin, Users, Calendar, Shield, Zap, Smartphone, Instagram, Youtube } from "lucide-react";

type NavbarLandingProps = {
  isDark: boolean;
  toggleDarkMode: () => void;
  handleSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
};

const NavbarLanding = ({ isDark, toggleDarkMode, handleSmoothScroll }: NavbarLandingProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isDark ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' : 'bg-white/95 backdrop-blur-md shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
              <img src="/logo/logo.png" alt="Logo Desa Jelegong" className="object-contain w-10 h-10" />
            </div>
            <div>
              <h1 className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>PinFaDes</h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Desa Jelegong</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#hero" onClick={e => handleSmoothScroll(e, 'hero')} className={`font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-emerald-600'}`}>Beranda</a>
            <a href="#fasilitas" onClick={e => handleSmoothScroll(e, 'fasilitas')} className={`font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-emerald-600'}`}>Fasilitas</a>
            <a href="#tatacara" onClick={e => handleSmoothScroll(e, 'tatacara')} className={`font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-emerald-600'}`}>Tata Cara</a>
            <a href="#mengapa" onClick={e => handleSmoothScroll(e, 'mengapa')} className={`font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-emerald-600'}`}>Mengapa PinFaDes?</a>
            <a href="#profil" onClick={e => handleSmoothScroll(e, 'profil')} className={`font-medium transition-colors ${isDark ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-700 hover:text-emerald-600'}`}>Profil</a>
            <a href="/login" className={`ml-2 px-5 py-2 rounded-xl font-bold shadow transition-all duration-200 ${isDark ? 'bg-cyan-700 text-white hover:bg-cyan-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>Login</a>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}> 
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#hero" onClick={e => handleSmoothScroll(e, 'hero')} className={`block px-3 py-2 rounded-md transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Beranda</a>
            <a href="#fasilitas" onClick={e => handleSmoothScroll(e, 'fasilitas')} className={`block px-3 py-2 rounded-md transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Fasilitas</a>
            <a href="#tatacara" onClick={e => handleSmoothScroll(e, 'tatacara')} className={`block px-3 py-2 rounded-md transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Tata Cara</a>
            <a href="#mengapa" onClick={e => handleSmoothScroll(e, 'mengapa')} className={`block px-3 py-2 rounded-md transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Mengapa PinFaDes?</a>
            <a href="#profil" onClick={e => handleSmoothScroll(e, 'profil')} className={`block px-3 py-2 rounded-md transition-colors ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}>Profil</a>
            <a href="/login" className={`block mt-2 px-3 py-2 rounded-xl font-bold shadow transition-all duration-200 text-center ${isDark ? 'bg-cyan-700 text-white hover:bg-cyan-800' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>Login</a>
          </div>
        </div>
      )}
    </nav>
  );
};

import { useRef, useEffect } from "react";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(true);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  // Smooth scroll handler for all anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Auto-slide for mobile carousel (Mengapa PinFaDes) ---
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideCount = 3;
  const slideInterval = 3500; // ms
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let timeout: NodeJS.Timeout;
    const scrollToSlide = (idx: number) => {
      const slide = carousel.children[idx] as HTMLElement;
      if (slide) {
        // Calculate the left offset of the slide relative to the carousel
        const left = slide.offsetLeft;
        carousel.scrollTo({ left, behavior: 'smooth' });
      }
    };
    timeout = setTimeout(() => {
      const next = (activeSlide + 1) % slideCount;
      setActiveSlide(next);
      scrollToSlide(next);
    }, slideInterval);
    return () => clearTimeout(timeout);
  }, [activeSlide]);

  // Update activeSlide on manual scroll (sync dots)
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const handleScroll = () => {
      const children = Array.from(carousel.children) as HTMLElement[];
      const scrollLeft = carousel.scrollLeft;
      const slideWidth = children[0]?.offsetWidth || 1;
      const idx = Math.round(scrollLeft / slideWidth);
      setActiveSlide(idx);
    };
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50'}`}>
      <NavbarLanding isDark={isDark} toggleDarkMode={toggleDarkMode} handleSmoothScroll={handleSmoothScroll} />
      
      {/* Hero Section */}
      <section className={`pt-20 pb-16 px-6 md:px-12 lg:px-24 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50'}`} id="hero">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium mb-6 animate-pulse">
                <MapPin className="w-4 h-4 mr-2" />
                Desa Jelegong, Rancaekek
              </div>
              
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  PinFaDes
                </span>
                <br />
                <span className={`text-3xl md:text-4xl lg:text-5xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Mudah & Cepat
                </span>
              </h1>
              
              <p className={`text-xl md:text-2xl mb-8 font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Satu aplikasi untuk semua kebutuhan fasilitas desa: <span className="text-emerald-600 font-bold">aula, kursi, sound system, tenda</span>, dan lainnya. Ada yang <span className="text-cyan-600 font-bold">GRATIS</span>, ada juga yang <span className="text-emerald-600 font-bold">bisa disewa</span>. Proses cepat & transparan!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a href="/login" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Mulai Pinjam Sekarang
                </a>
                <a
                  href="#tatacara"
                  onClick={e => handleSmoothScroll(e, 'tatacara')}
                  className={`px-8 py-4 font-bold rounded-2xl border-2 transition-all duration-300 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'}`}
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-emerald-600 mr-2" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>1000+ Warga Aktif</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-cyan-600 mr-2" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Aman & Terpercaya</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
                <div className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
                  <div className="w-80 h-80 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Smartphone className="w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Fasilitas Desa</h3>
                      <p className="text-sm opacity-90">Mudah diakses kapan saja</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 px-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {[
              { number: "15+", label: "Fasilitas Tersedia", icon: "🏢" },
              { number: "500+", label: "Peminjaman Sukses", icon: "✅" },
              { number: "24/7", label: "Akses Online", icon: "🕐" },
              { number: "Gratis & Sewa", label: "Tersedia Gratis & Berbayar", icon: "�" }
            ].map((stat, index) => (
              <div key={index} className={`text-center p-6 rounded-2xl ${isDark ? 'bg-gray-700 shadow-xl border border-gray-600' : 'bg-white shadow-xl'}`}>
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section className="py-16 px-6" id="fasilitas">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Fasilitas <span className="text-emerald-600">Lengkap</span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Berbagai fasilitas desa siap mendukung kegiatan Anda
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Aula & Ruang Rapat",
                description: "Tempat pertemuan, seminar, dan acara warga dengan kapasitas besar",
                icon: "🏛️",
                color: "from-emerald-500 to-green-500"
              },
              {
                title: "Kursi & Meja",
                description: "Perlengkapan acara dengan berbagai pilihan jumlah dan ukuran",
                icon: "🪑",
                color: "from-cyan-500 to-blue-500"
              },
              {
                title: "Sound System",
                description: "Perangkat audio profesional untuk mendukung acara dan pengumuman",
                icon: "🎵",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Tenda & Canopy",
                description: "Untuk acara outdoor, bazar, dan kegiatan lapangan",
                icon: "⛺",
                color: "from-orange-500 to-red-500"
              },
              {
                title: "Perlengkapan Olahraga",
                description: "Fasilitas untuk kegiatan olahraga dan rekreasi warga",
                icon: "⚽",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Peralatan Dapur",
                description: "Kompor, panci, dan peralatan masak untuk acara besar",
                icon: "🍳",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((facility, index) => (
              <div
                key={index}
                className={`group ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center`}
              >
                <div className={`w-8 h-8 sm:w-14 sm:h-14 bg-gradient-to-r ${facility.color} rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-lg sm:text-2xl">{facility.icon}</span>
                </div>
                <h3 className={`text-xs sm:text-lg font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
                  {facility.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[10px] sm:text-sm leading-snug text-center`}>
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tata Cara Section */}
      <section className="py-16 px-6" id="tatacara">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Cara <span className="text-cyan-600">Peminjaman</span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Proses yang mudah dan cepat dalam 5 langkah
            </p>
          </div>
          
          {/* Custom grid for mobile: 3 kolom atas, 2 kolom bawah, card kecil */}
          <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Desktop/tablet: default 1/2/3 cols */}
            {[
              {
                step: "01",
                title: "Daftar & Login",
                description: "Buat akun atau login dengan data warga yang valid"
              },
              {
                step: "02",
                title: "Pilih Fasilitas",
                description: "Pilih fasilitas yang dibutuhkan dan cek ketersediaan"
              },
              {
                step: "03",
                title: "Isi Formulir",
                description: "Lengkapi formulir pengajuan dengan detail acara"
              },
              {
                step: "04",
                title: "Konfirmasi Admin",
                description: "Tunggu persetujuan dari admin desa (maksimal 24 jam)"
              },
              {
                step: "05",
                title: "Ambil & Kembalikan",
                description: "Ambil fasilitas sesuai jadwal dan kembalikan tepat waktu"
              }
            ].map((step, index) => (
              <div key={index} className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-xl`}>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{step.step}</span>
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
                  {step.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          {/* Mobile custom grid: 3 kolom atas, 2 kolom bawah, card kecil */}
          <div className="sm:hidden flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  step: "01",
                  title: "Daftar & Login",
                  description: "Buat akun atau login dengan data warga yang valid"
                },
                {
                  step: "02",
                  title: "Pilih Fasilitas",
                  description: "Pilih fasilitas yang dibutuhkan dan cek ketersediaan"
                },
                {
                  step: "03",
                  title: "Isi Formulir",
                  description: "Lengkapi formulir pengajuan dengan detail acara"
                }
              ].map((step, index) => (
                <div key={index} className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-md flex flex-col items-center min-h-[110px]`}>
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{step.step}</span>
                  </div>
                  <h3 className={`text-[11px] font-bold mb-1 mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
                    {step.title}
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[9px] leading-tight text-center`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                {
                  step: "04",
                  title: "Konfirmasi Admin",
                  description: "Tunggu persetujuan dari admin desa (maksimal 24 jam)"
                },
                {
                  step: "05",
                  title: "Ambil & Kembalikan",
                  description: "Ambil fasilitas sesuai jadwal dan kembalikan tepat waktu"
                }
              ].map((step, index) => (
                <div key={index} className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-md flex flex-col items-center min-h-[110px]`}>
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{step.step}</span>
                  </div>
                  <h3 className={`text-[11px] font-bold mb-1 mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
                    {step.title}
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-[9px] leading-tight text-center`}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section className="py-16 px-6" id="mengapa">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Mengapa <span className="text-purple-600">PinFaDes?</span>
            </h2>
          </div>
          {/* Desktop: grid, Mobile: horizontal scroll carousel */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Cepat & Mudah",
                description: "Pengajuan dan konfirmasi hanya dalam hitungan menit",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: <span className="text-2xl">💸</span>,
                title: "Gratis & Sewa",
                description: "Ada fasilitas gratis, ada juga yang bisa disewa dengan harga terjangkau",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile Friendly",
                description: "Akses dari mana saja, kapan saja dengan tampilan responsif",
                color: "from-blue-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <div key={index} className={`text-center p-8 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 text-white`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          {/* Mobile: horizontal scroll carousel with auto-slide */}
          <div className="md:hidden relative">
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Cepat & Mudah",
                  description: "Pengajuan dan konfirmasi hanya dalam hitungan menit",
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: <span className="text-2xl">💸</span>,
                  title: "Gratis & Sewa",
                  description: "Ada fasilitas gratis, ada juga yang bisa disewa dengan harga terjangkau",
                  color: "from-green-500 to-emerald-500"
                },
                { 
                  icon: <Smartphone className="w-8 h-8" />,
                  title: "Mobile Friendly",
                  description: "Akses dari mana saja, kapan saja dengan tampilan responsif",
                  color: "from-blue-500 to-cyan-500"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`min-w-[80vw] max-w-[80vw] snap-center text-center p-6 rounded-3xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-all duration-300 flex-shrink-0`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Carousel dots */}
            <div className="flex justify-center mt-4 gap-2">
              {[0,1,2].map(i => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full bg-emerald-400 transition-all duration-300 ${activeSlide === i ? 'opacity-100 scale-125' : 'opacity-60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profil Desa Section */}
      <section className="py-16 px-6" id="profil">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 overflow-hidden bg-transparent">
            <img src="/logo/logo.png" alt="Logo Desa Jelegong" className="object-contain w-20 h-20" />
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Profil <span className="text-emerald-600">Desa Jelegong</span>
          </h2>
          <p className={`text-xl leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Desa Jelegong adalah desa yang aktif, ramah, dan selalu mendukung kegiatan warganya. 
            Dengan sistem digital PinFaDes, peminjaman fasilitas desa kini lebih mudah, 
            transparan, dan efisien untuk semua warga.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Jelegong, Rancaekek, Kabupaten Bandung
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-7 px-2 sm:py-12 sm:px-6 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700' : 'bg-gradient-to-br from-white via-cyan-50 to-emerald-50 border-t border-gray-200'}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:grid sm:grid-cols-2 gap-0 sm:gap-8 items-stretch sm:text-left relative">
          {/* Divider mobile */}
          <div className="w-full flex sm:hidden justify-center my-4">
            <div className="w-16 h-1 rounded-full bg-gray-300 opacity-20" />
          </div>
          {/* Info & Sosmed */}
          <div className="flex flex-col items-center justify-center py-2 px-1 sm:py-0 sm:px-0 mb-4 sm:mb-0">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2 sm:mb-6 shadow-lg overflow-hidden bg-transparent">
              <img src="/logo/logo.png" alt="Logo Desa Jelegong" className="object-contain w-12 h-12" />
            </div>
            <h3 className={`text-lg sm:text-2xl font-bold mb-1 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}> 
              PinFaDes - Pinjam Fasilitas Desa
            </h3>
            <p className={`mb-2 sm:mb-4 text-xs sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} text-center`}> 
              Melayani warga Desa Jelegong dengan sepenuh hati
            </p>
            {/* Sosmed dihapus sesuai permintaan */}
            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1 sm:mt-0 text-center`}> 
              &copy; {new Date().getFullYear()} Desa Jelegong. All rights reserved.
            </div>
          </div>
          {/* Google Maps */}
          <div className="flex flex-col justify-center items-center py-2 px-1 sm:py-0 sm:px-0">
            <div className="w-full flex justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.429891073745!2d107.77212357587636!3d-6.958509068130224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c4860ff36fed%3A0x5d48039496b5e833!2sKantor%20Desa%20Jelegong%20Rancaekek!5e0!3m2!1sid!2sid!4v1752982812423!5m2!1sid!2sid"
                width="100%"
                height="110"
                className="rounded-xl sm:rounded-2xl shadow-lg"
                style={{ border: 0, maxWidth: 260, minWidth: 100 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kantor Desa Jelegong"
              ></iframe>
            </div>
            <div className={`text-[11px] sm:text-xs mt-2 text-gray-400 text-center`}>Lihat lokasi kantor desa di Google Maps</div>
          </div>
        </div>
      </footer>
    </div>
  );
}