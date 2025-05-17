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
    { id: 1, image: '/service-1.png' },
    { id: 2, image: '/service-2.png' },
    { id: 3, image: '/service-3.png' },
  ];

  const faqItems = [
    { id: 1, question: 'Apa itu InsightU?', answer: 'InsightU adalah platform untuk membantu memilih jurusan.' },
    { id: 2, question: 'Bagaimana cara konsultasi?', answer: 'Kamu bisa login dan memilih jadwal konsultasi.' },
    { id: 3, question: 'Apakah layanan ini gratis?', answer: 'Beberapa fitur gratis, sebagian premium.' },
    { id: 4, question: 'Bagaimana cara mendaftar?', answer: 'Klik tombol Register dan isi data kamu.' },
  ];

  return (
    <div className="bg-[#c8c4c4] flex flex-row justify-center w-full">
      <div className="bg-[#c8c4c4] w-full max-w-[1440px]">
        {/* Header */}
        <header className="flex items-center pt-12 px-24">
          <div className="flex items-center">
            <h1 className="font-normal text-black text-5xl">InsightU</h1>
            <div className="ml-8 w-[154px] h-[109px] bg-[#d9d9d9] rounded-full flex items-center justify-center">
              <span className="text-black text-xl">Logo</span>
            </div>
          </div>
          <nav className="flex ml-auto items-center gap-8">
            <span className="text-black text-2xl">Beranda</span>
            <span className="text-black text-2xl">Tentang</span>
            <Link href="/login">
              <Button className="w-[129px] h-[37px] bg-[#4380f0] rounded-none text-white text-2xl">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-[129px] h-[37px] bg-[#4380f0] rounded-none text-white text-2xl">
                Register
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="mt-[225px] mx-[81px] flex flex-col md:flex-row gap-8">
          <div className="bg-[#4380f0] w-full max-w-[967px] h-[438px] relative text-white p-12">
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
              src="/hero-character.png"
              alt="Character"
              className="w-full h-full object-cover"
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
                className="w-full max-w-[380px] h-[503px] bg-[#4380f0] rounded-none"
              >
                <CardContent className="p-0">
                  <div className="w-[316px] h-[63px] mt-[58px] mx-auto bg-[#d9d9d9]" />
                  <div className="flex justify-center mt-[60px]">
                    <img
                      className="w-[230px] h-[230px] object-contain"
                      alt={`Service ${service.id}`}
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
                className="mb-[38px]"
              >
                <AccordionTrigger className="h-[86px] bg-[#4380f0] px-6 text-white hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="bg-[#e0e0e0] p-4">
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
            <Phone className="w-[81px] h-[81px]" />
          </div>
          <div className="mt-4">
            <div className="w-[496px] h-[154px] bg-[#4380f0]" />
            <div className="w-[109px] h-8 mt-10 bg-[#4380f0]" />
          </div>
        </section>
      </div>
    </div>
  );
}
