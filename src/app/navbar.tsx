"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavbarLanding() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 10) {
        navRef.current.classList.add("navbar-shrink");
        navRef.current.classList.remove("navbar-dark");
        navRef.current.classList.add("navbar-light");
      } else {
        navRef.current.classList.remove("navbar-shrink");
        navRef.current.classList.remove("navbar-light");
        navRef.current.classList.add("navbar-dark");
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Set initial state
    if (navRef.current) navRef.current.classList.add("navbar-dark");
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className="navbar p-4 flex justify-between items-center shadow-md rounded-b-xl border-b border-cyan-100 sticky top-0 z-20 transition-all"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md overflow-hidden bg-white">
          <img src="/logo/logo.png" alt="Logo Desa Jelegong" className="object-contain w-9 h-9" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-cyan-100">Desa Jelegong</span>
          <span className="text-xs font-medium text-cyan-300">Portal Warga</span>
        </div>
      </div>
      <nav className="hidden md:flex gap-6">
        <Link href="/" className="hover:text-cyan-300 font-bold transition-colors text-cyan-100">Beranda</Link>
        <Link href="/comp-landing/fasilitas" className="hover:text-cyan-300 font-bold transition-colors text-cyan-100">Fasilitas</Link>
        <Link href="/comp-landing/tata-cara" className="hover:text-cyan-300 font-bold transition-colors text-cyan-100">Tata Cara</Link>
        <Link href="/comp-landing/syarat" className="hover:text-cyan-300 font-bold transition-colors text-cyan-100">Syarat</Link>
        <Link href="/login" className="px-4 py-2 bg-cyan-700 text-white rounded shadow hover:bg-cyan-800 transition-transform hover:scale-105 font-bold">Login</Link>
      </nav>
      <style jsx global>{`
        .navbar-dark {
          background: linear-gradient(90deg, #164e63 60%, #0e7490 100%);
        }
        .navbar-light {
          background: rgba(255,255,255,0.95);
        }
        .navbar {
          transition: background 0.4s, box-shadow 0.4s, padding 0.4s, color 0.4s;
        }
        .navbar-shrink {
          box-shadow: 0 8px 32px 0 rgba(14,116,144,0.10);
          padding-top: 0.2rem !important;
          padding-bottom: 0.2rem !important;
        }
      `}</style>
    </header>
  );
}