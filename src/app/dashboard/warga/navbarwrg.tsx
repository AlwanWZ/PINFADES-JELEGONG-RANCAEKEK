"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaHome, 
  FaPlusCircle, 
  FaHistory, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaUser,
  FaBell
} from "react-icons/fa";
import Link from "next/link";

interface NavbarWargaProps {
  darkMode?: boolean;
  setDarkMode?: (val: boolean) => void;
}


export default function NavbarWarga({ darkMode = false, setDarkMode }: NavbarWargaProps) {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [uid, setUid] = useState<string | null>(null);

  // Ambil uid dari localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUid = localStorage.getItem("uid");
      setUid(storedUid && storedUid.trim() !== '' ? storedUid : null);
    }
  }, []);

  // Fetch jumlah notifikasi user
  useEffect(() => {
    if (!uid) {
      setNotifications(0);
      return;
    }
    const fetchNotif = async () => {
      try {
        const res = await fetch(`/api/notifikasi?uid=${uid}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setNotifications(json.data.length);
        } else {
          setNotifications(0);
        }
      } catch {
        setNotifications(0);
      }
    };
    fetchNotif();
  }, [uid]);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 10) {
        navRef.current.classList.add("navbar-shrink");
      } else {
        navRef.current.classList.remove("navbar-shrink");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: "/dashboard/warga", icon: FaHome, label: "Dashboard" },
    { href: "/dashboard/warga/ajukan", icon: FaPlusCircle, label: "Ajukan" },
    { href: "/dashboard/warga/riwayat", icon: FaHistory, label: "Riwayat" },
  ];

  return (
    <>
      <nav 
        ref={navRef} 
        className={`navbar w-full sticky top-0 z-50 transition-all duration-300 ease-in-out border-b ${darkMode ? 'bg-gradient-to-r from-gray-900 to-cyan-950 border-cyan-900/50 shadow-cyan-900/30' : 'bg-gradient-to-r from-cyan-50/95 to-cyan-100/95 border-cyan-200/50 shadow-lg light'} backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                <img src="/logo/logo.png" alt="Logo Desa Jelegong" className="object-contain w-9 h-9" />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-xl tracking-tight ${darkMode ? 'text-cyan-100' : 'text-cyan-900'}`}>Desa Jelegong</span>
                <span className={`text-xs font-medium ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>Portal Warga</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link 
                  key={item.label}
                  href={item.href} 
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
                >
                  <item.icon className="text-sm group-hover:animate-pulse" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <Link
                href="/dashboard/warga/notifikasi"
                className={`relative p-2 rounded-full transition-all duration-200 ${darkMode ? 'text-cyan-200 hover:text-cyan-100 hover:bg-cyan-900' : 'text-cyan-600 hover:text-cyan-800 hover:bg-cyan-100'}`}
                title="Notifikasi"
              >
                <FaBell className="text-lg" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </Link>

              {/* Toggle Dark/Light Mode */}
              {setDarkMode && (
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
              )}

              {/* User Profile - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <button
                  className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${darkMode ? 'text-red-300 hover:text-red-100 hover:bg-red-900' : 'text-red-600 hover:text-red-800 hover:bg-red-50'}`}
                  onClick={async () => {
                    if (logoutLoading) return;
                    const confirmed = window.confirm("Apakah anda yakin ingin logout?");
                    if (confirmed) {
                      setLogoutLoading(true);
                      setTimeout(() => {
                        setLogoutLoading(false);
                        router.push("/");
                      }, 1200);
                    }
                  }}
                  disabled={logoutLoading}
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:block">{logoutLoading ? "Logout..." : "Logout"}</span>
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${darkMode ? 'text-emerald-200 hover:text-emerald-100 hover:bg-emerald-900' : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100'}`}
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 z-40 ${darkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`}>
          <div className={`fixed top-16 right-0 w-80 h-full ${darkMode ? 'bg-gray-900/95 text-white border-cyan-900' : 'bg-white/95 text-cyan-900 border-cyan-200'} backdrop-blur-xl shadow-2xl border-l transform transition-transform duration-300 ease-in-out`}>
            <div className="p-6 space-y-6">
              {/* User Profile Section */}
              <div className={`flex items-center space-x-3 pb-6 border-b ${darkMode ? 'border-cyan-900' : 'border-cyan-100'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-cyan-700 to-cyan-900' : 'bg-gradient-to-br from-cyan-400 to-cyan-600'}`}>
                  <FaUser className="text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-cyan-100' : 'text-cyan-900'}`}>Nama Warga</p>
                  <p className={`text-sm ${darkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>ID: 123456789</p>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 p-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-cyan-100 hover:text-white hover:bg-gradient-to-r hover:from-cyan-700 hover:to-cyan-900' : 'text-cyan-700 hover:text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-cyan-600'}`}
                  >
                    <item.icon className="text-lg" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Logout Button */}
              <div className={`pt-6 border-t ${darkMode ? 'border-cyan-900' : 'border-cyan-100'}`}>
                <button
                  onClick={async () => {
                    if (logoutLoading) return;
                    const confirmed = window.confirm("Apakah anda yakin ingin logout?");
                    if (confirmed) {
                      setLogoutLoading(true);
                      setTimeout(() => {
                        setLogoutLoading(false);
                        setIsMobileMenuOpen(false);
                        router.push("/");
                      }, 1200);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`flex items-center space-x-4 p-4 w-full rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${darkMode ? 'text-red-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900 hover:to-red-700' : 'text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600'}`}
                  disabled={logoutLoading}
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>{logoutLoading ? "Logout..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .navbar-shrink {
          box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);
          backdrop-filter: blur(20px);
          background: linear-gradient(to right, #0f172a 95%, #155e75 100%) !important;
          border-bottom: 1.5px solid #164e63 !important;
          color: #e0f2fe !important;
        }
        .navbar-shrink.light {
          background: linear-gradient(to right, #e0f2fe 95%, #bae6fd 100%) !important;
          border-bottom: 1.5px solid #38bdf8 !important;
          color: #0e7490 !important;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}