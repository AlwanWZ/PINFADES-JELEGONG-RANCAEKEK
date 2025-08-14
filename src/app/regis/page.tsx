"use client";
import { useState } from "react";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Eye, EyeOff, User, Lock, Mail, Sun, Moon } from "lucide-react";
import Link from "next/link";

export default function RegisPage() {
  const [isDark, setIsDark] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  // Google sign up/login
  const handleGoogleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // You can check result.user, result.user.email, etc.
      // For demo, redirect all Google users to warga dashboard
      window.location.href = "/dashboard/warga";
    } catch (err: any) {
      setError("Gagal daftar/login dengan Google. Silakan coba lagi.");
    }
    setLoading(false);
  };

  const handleRegis = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Password tidak sama!");
      return;
    }
    setLoading(true);
    try {
      // Register user ke Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Simpan data user ke Firestore via API
      await fetch("/api/regis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: username
        })
      });
      setSuccess("Registrasi berhasil! Redirect ke dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard/warga";
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Gagal registrasi. Silakan coba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50"}`}>
      <div className={`absolute top-4 right-4`}>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-lg transition-colors ${isDark ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <img
              src="/logo/logo.png"
              alt="Logo Desa Jelegong"
              className="w-16 h-16 object-contain"
              style={{ background: 'none' }}
            />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Registrasi</h2>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Buat akun baru</p>
        </div>
        <form onSubmit={handleRegis}>
          <div className="mb-4">
            <label className={`block mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Username</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-900 border-gray-700 text-white focus:ring-cyan-600" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-cyan-400"}`}
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <User className="absolute right-3 top-3 w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className={`block mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</label>
            <div className="relative">
              <input
                type="email"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-900 border-gray-700 text-white focus:ring-cyan-600" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-cyan-400"}`}
                placeholder="Masukkan email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute right-3 top-3 w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className={`block mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-900 border-gray-700 text-white focus:ring-cyan-600" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-cyan-400"}`}
                placeholder="Masukkan password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-10 top-3 text-cyan-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <Lock className="absolute right-3 top-3 w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className={`block mb-1 font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Konfirmasi Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${isDark ? "bg-gray-900 border-gray-700 text-white focus:ring-cyan-600" : "bg-gray-100 border-gray-300 text-gray-900 focus:ring-cyan-400"}`}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <Lock className="absolute right-3 top-3 w-5 h-5 text-cyan-500" />
            </div>
          </div>
          {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="mb-4 text-green-500 text-sm text-center">{success}</div>}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold shadow transition-all duration-200 mb-4 flex items-center justify-center ${isDark ? "bg-cyan-700 text-white hover:bg-cyan-800" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Registrasi"}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className={`w-full py-3 rounded-xl font-bold shadow transition-all duration-200 flex items-center justify-center gap-2 ${isDark ? "bg-white text-gray-900 hover:bg-gray-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            disabled={loading}
          >
            <span className="w-5 h-5 inline-block mr-1 align-middle">
              {/* Google SVG icon */}
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path d="M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36.5 26 36.5C19.7 36.5 14.5 31.3 14.5 25C14.5 18.7 19.7 13.5 26 13.5C28.7 13.5 31.1 14.5 33 16.2L38.2 11C34.8 7.9 30.6 6 26 6C15.5 6 7 14.5 7 25C7 35.5 15.5 44 26 44C36.5 44 45 35.5 45 25C45 23.7 44.8 22.3 44.5 20Z" fill="#FFC107"/>
                  <path d="M9.7 14.1L16.6 19.1C18.5 15.2 21.9 13.5 26 13.5C28.7 13.5 31.1 14.5 33 16.2L38.2 11C34.8 7.9 30.6 6 26 6C19.7 6 14.1 9.8 9.7 14.1Z" fill="#FF3D00"/>
                  <path d="M26 44C31.1 44 35.7 42.1 39.1 39.1L32.7 34.3C30.6 35.7 28.1 36.5 26 36.5C20.8 36.5 16.5 33.1 15.1 28.5L8.2 33.6C11.6 39.1 18.2 44 26 44Z" fill="#4CAF50"/>
                  <path d="M44.5 20H24V28.5H36.9C36.3 30.5 35.1 32.2 33.4 33.4C33.4 33.4 33.4 33.4 33.4 33.4L39.1 39.1C41.7 36.7 43.5 33.1 44.5 29.1C44.8 27.7 45 26.4 45 25C45 23.7 44.8 22.3 44.5 20Z" fill="#1976D2"/>
                </g>
              </svg>
            </span>
            {loading ? "Memproses..." : "Daftar/Login dengan Google"}
          </button>
          <Link href="/login" className={`w-full block py-3 rounded-xl font-bold shadow transition-all duration-200 text-center ${isDark ? "bg-emerald-700 text-white hover:bg-emerald-800" : "bg-emerald-500 text-white hover:bg-emerald-600"}`}>
            Sudah punya akun? Login
          </Link>
          <Link href="/" className={`w-full block py-3 rounded-xl font-bold shadow transition-all duration-200 text-center border ${isDark ? "bg-transparent border-cyan-700 text-cyan-200 hover:bg-cyan-900/40" : "bg-transparent border-cyan-400 text-cyan-700 hover:bg-cyan-100"}`}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
