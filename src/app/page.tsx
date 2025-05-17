'use client';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-gray-800">InsightU</div>
          <div className="rounded-full w-10 h-10 bg-gray-300 text-sm flex items-center justify-center">Logo</div>
        </div>
        <nav className="flex space-x-4">
          <Link href="#" className="px-4 py-2 hover:underline">Beranda</Link>
          <Link href="#" className="px-4 py-2 hover:underline">Tentang</Link>
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
          <Link href="/register" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Register</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-12 bg-blue-400 text-white">
        <div className="max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Anda ada masalah dalam pemilihan Jurusan? Jangan Khawatir, InsightU solusinya</h2>
          <p className="text-base">InsightU adalah sebuah web yang menawarkan sesi konsultasi untuk menemukan minat dan bakat</p>
        </div>
        <div className="w-60 h-60 mt-8 md:mt-0">
          <img src="/hero-character.png" alt="Character" className="w-full h-full object-contain" />
        </div>
      </section>

      {/* Layanan Utama */}
      <section className="px-8 py-12">
        <h3 className="text-xl font-semibold mb-6">Layanan Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-blue-400 p-4 rounded">
              <div className="w-full h-40 bg-white rounded mb-4 flex items-center justify-center">
                <img src={`/service-${i}.png`} alt={`Service ${i}`} className="h-full object-contain" />
              </div>
              <div className="h-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-8 py-12">
        <h3 className="text-xl font-semibold mb-6">FAQ</h3>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-blue-500 rounded mb-4"></div>
        ))}
      </section>

      {/* Kontak */}
      <section className="px-8 py-12">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">Kontak 📞</h3>
        <div className="h-24 bg-blue-500 w-80 rounded mb-2"></div>
        <div className="w-16 h-4 bg-blue-500 rounded"></div>
      </section>
    </main>
  );
}
