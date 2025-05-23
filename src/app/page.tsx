'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export default function Home() {
  const services = [
    { id: 1, image: '/images/counseling.png', title: 'Konseling Karier' },
    { id: 2, image: '/images/test-minat.png', title: 'Tes Minat Bakat' },
    { id: 3, image: '/images/consult-psychologist.png', title: 'Konsultasi Psikolog' },
  ];

  const faqItems = [
    {
      id: 1,
      question: 'Apa itu InsightU?',
      answer: 'InsightU adalah platform digital yang menyediakan layanan konseling dan tes minat bakat untuk membantu siswa menemukan jurusan dan karier yang sesuai dengan potensi diri.'
    },
    {
      id: 2,
      question: 'Bagaimana cara konsultasi?',
      answer: 'Setelah login, kamu bisa memilih jadwal dan psikolog untuk sesi konsultasi. Kamu juga bisa melihat riwayat sesi dan status sesi sebelumnya.'
    },
    {
      id: 3,
      question: 'Apakah layanan ini gratis?',
      answer: 'InsightU menyediakan layanan gratis terbatas untuk fitur dasar. Untuk akses penuh ke tes psikologi lanjutan dan psikolog profesional, pengguna dapat berlangganan.'
    },
    {
      id: 4,
      question: 'Bagaimana cara mendaftar?',
      answer: 'Klik tombol Register di pojok kanan atas halaman, lalu isi formulir pendaftaran sesuai dengan data diri kamu. Setelah itu, verifikasi email dan login untuk memulai.'
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1440px]">
        {/* Header */}
        <header className="flex items-center justify-between pt-12 px-24">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 relative">
              <img
                src="/images/logo.png"
                alt="InsightU Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="font-semibold text-black text-4xl">InsightU</h1>
          </div>
          <nav className="flex items-center gap-8">
            <span className="text-black text-xl hover:text-[#4380f0] cursor-pointer">Beranda</span>
            <span className="text-black text-xl hover:text-[#4380f0] cursor-pointer">Tentang</span>
            <Link href="/login">
              <Button className="px-6 py-2 bg-[#4380f0] rounded-lg text-white text-base font-medium">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="px-6 py-2 bg-[#4380f0] rounded-lg text-white text-base font-medium">
                Register
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="mt-[225px] mx-[81px] flex flex-col md:flex-row gap-8">
          <div className="bg-[#4380f0] w-full max-w-[967px] h-[438px] relative text-white p-12 rounded-2xl">
            <h2 className="text-3xl md:text-4xl mb-6 font-semibold">
              Anda ada masalah dalam pemilihan Jurusan?
              <br />
              Jangan Khawatir, InsightU solusinya
            </h2>
            <p className="text-xl">
              InsightU adalah sebuah web yang menawarkan sesi konsultasi
              untuk menemukan minat dan bakat
            </p>
          </div>
          <div className="w-[437px] h-[437px]">
            <img
              src="/images/hero-character.png"
              alt="Karakter Konseling"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </section>

        {/* Layanan Utama */}
        <section className="mt-[90px] mx-[83px]">
          <h2 className="text-black text-[40px] mb-10">Layanan Utama</h2>
          <div className="flex flex-col md:flex-row gap-[67px]">
            {services.map((service) => (
              <Card
                key={service.id}
                className="w-full max-w-[380px] h-[503px] bg-[#4380f0] rounded-xl text-white"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <h3 className="text-2xl font-semibold text-center mb-4">{service.title}</h3>
                  <div className="flex justify-center">
                    <img
                      className="w-[230px] h-[230px] object-contain rounded"
                      alt={service.title}
                      src={service.image}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-[70px] mx-24">
          <h2 className="text-black text-[40px] mb-10">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={`item-${item.id}`}
                className="mb-[38px] rounded-md overflow-hidden"
              >
                <AccordionTrigger className="h-[86px] bg-[#4380f0] px-6 text-white hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="bg-[#e0e0e0] p-4 text-black">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Kontak */}
        <section className="mt-[70px] mx-[107px] pb-16">
          <div className="flex items-center gap-4">
            <h2 className="text-black text-[40px]">Kontak</h2>
            <Phone className="w-6 h-6" />
          </div>
          <div className="mt-4 text-lg text-black">
            <p>Email: andikamaskar@gmail.com</p>
          </div>
        </section>
      </div>
    </div>
  );
}
