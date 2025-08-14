"use client";
import { FaHome, FaUsers, FaChair, FaClipboardList, FaSignOutAlt, FaBars, FaTimes, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface NavbarAdminProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}

export default function NavbarAdmin({ darkMode = false, setDarkMode }: NavbarAdminProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`w-full sticky top-0 z-50 border-b backdrop-blur-lg shadow-lg transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-gray-900 to-cyan-950 border-cyan-900/50' : 'bg-gradient-to-r from-cyan-50/95 to-cyan-100/95 border-cyan-200/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              <img src="/logo/logo.png" alt="Logo Desa Jelegong" className="object-contain w-9 h-9" />
            </div>
            <div className="flex flex-col ml-3">
              <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-cyan-100' : 'text-cyan-900'}`}>Desa Jelegong</span>
              <span className={`text-xs font-medium ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Admin Panel</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard/admin" className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}>
              <FaHome className="text-sm group-hover:animate-pulse" />
              <span>Dashboard</span>
            </Link>
            <Link href="/dashboard/admin/warga" className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}>
              <FaUsers className="text-sm group-hover:animate-pulse" />
              <span>Warga</span>
            </Link>
            <Link href="/dashboard/admin/fasilitas" className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}>
              <FaChair className="text-sm group-hover:animate-pulse" />
              <span>Fasilitas</span>
            </Link>
            <Link href="/dashboard/admin/peminjaman" className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}>
              <FaClipboardList className="text-sm group-hover:animate-pulse" />
              <span>Peminjaman</span>
            </Link>
            <Link href="/dashboard/admin/transaksi" className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}>
              <FaMoneyCheckAlt className="text-sm group-hover:animate-pulse" />
              <span>Transaksi</span>
            </Link>
            {/* Toggle Dark/Light Mode */}
            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`ml-4 p-2 rounded-full border transition-all duration-200 ${darkMode ? 'bg-gray-800 border-cyan-900 text-cyan-100 hover:bg-cyan-900' : 'bg-white border-cyan-200 text-cyan-700 hover:bg-cyan-100'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                )}
              </button>
            )}
            <div className="ml-4 pl-4 border-l border-cyan-200">
              <button
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-red-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900 hover:to-red-700' : 'text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600'}`}
                onClick={async () => {
                  if (logoutLoading) return;
                  const confirmed = window.confirm("Apakah anda yakin ingin logout?");
                  if (confirmed) {
                    setLogoutLoading(true);
                    try {
                      await signOut(auth);
                      // Spinner selama 1.2 detik, lalu redirect
                      setTimeout(() => {
                        setLogoutLoading(false);
                        router.push("/login");
                      }, 1200);
                    } catch (e) {
                      setLogoutLoading(false);
                      alert("Gagal logout. Silakan coba lagi.");
                    }
                  }
                }}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Logout...</span>
                  </>
                ) : (
                  <>
                    <FaSignOutAlt className="text-sm group-hover:scale-110 transition-transform" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-lg ${darkMode ? 'text-cyan-200 hover:bg-cyan-900 hover:text-white' : 'text-cyan-700 hover:bg-cyan-100 hover:text-cyan-800'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 transition-colors`}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 ${darkMode ? 'bg-gray-900/95 text-white border-cyan-900' : 'bg-white/95 text-cyan-900 border-cyan-200'} backdrop-blur-md border-t shadow-lg`}>
            <Link 
              href="/dashboard/admin" 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaHome className="text-lg" />
              Dashboard
            </Link>
            <Link 
              href="/dashboard/admin/warga" 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUsers className="text-lg" />
              Warga
            </Link>
            <Link 
              href="/dashboard/admin/fasilitas" 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaChair className="text-lg" />
              Fasilitas
            </Link>
            <Link 
              href="/dashboard/admin/peminjaman" 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaClipboardList className="text-lg" />
              Peminjaman
            </Link>
            <Link 
              href="/dashboard/admin/transaksi" 
              className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaMoneyCheckAlt className="text-lg" />
              Transaksi
            </Link>
            {/* Toggle Dark/Light Mode for mobile */}
            {setDarkMode && (
              <div className="border-t border-cyan-200 pt-3 mt-3 flex justify-center">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-full border transition-all duration-200 ${darkMode ? 'bg-gray-800 border-cyan-900 text-cyan-100 hover:bg-cyan-900' : 'bg-white border-cyan-200 text-cyan-700 hover:bg-cyan-100'}`}
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                  )}
                </button>
              </div>
            )}
            <div className="border-t border-cyan-200 pt-3 mt-3">
              <button
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${darkMode ? 'text-red-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900 hover:to-red-700' : 'text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600'}`}
                onClick={async () => {
                  if (logoutLoading) return;
                  const confirmed = window.confirm("Apakah anda yakin ingin logout?");
                  if (confirmed) {
                    setLogoutLoading(true);
                    setTimeout(() => {
                      setLogoutLoading(false);
                      setIsMenuOpen(false);
                      router.push("/");
                    }, 1200);
                  } else {
                    setIsMenuOpen(false);
                  }
                }}
                disabled={logoutLoading}
              >
                {logoutLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Logout...</span>
                  </>
                ) : (
                  <>
                    <FaSignOutAlt className="text-lg" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}