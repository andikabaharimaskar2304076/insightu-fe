'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

const teamMembers = [
  {
    id: 1,
    name: "Mochammad Syahrul Ramadhan",
    nim: "2300878",
    image: "/images/astronaut.png",
  },
  {
    id: 2,
    name: "Andika Bahari Maskar",
    nim: "2304076",
    image: "/images/astronaut.png",
  },
  {
    id: 3,
    name: "M.Syukri Yazid Muzaki",
    nim: "2305166",
    image: "/images/astronaut.png",
  },
  {
    id: 4,
    name: "Khairunnisak",
    nim: "2300424",
    image: "/images/astronaut.png",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1459px] relative py-12 px-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-20">
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
            <Link href='/'>
            <span className="text-black text-xl hover:text-[#4380f0] cursor-pointer">Beranda</span>
            </Link>
            <Link href="/about">
              <span className="text-black text-xl hover:text-[#4380f0] cursor-pointer">Tentang</span>
            </Link>
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

        {/* Penjelasan Website */}
        <section className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6 text-[#4380f0]">Apa itu InsightU?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
            InsightU adalah platform digital yang dirancang untuk membantu siswa dalam menentukan jurusan dan karier melalui layanan konsultasi psikologis dan tes minat bakat. Platform ini mempertemukan siswa dengan psikolog profesional dan menyediakan fitur komunikasi serta penjadwalan sesi konseling yang mudah dan efisien.
          </p>
        </section>

        {/* About Us Section */}
        <section className="flex flex-col items-center">
          <h2 className="font-bold text-4xl mb-12 text-[#4380f0]">Tim Pengembang</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 w-full max-w-[1126px]">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex items-center gap-4 p-4"
              >
                <div className="w-24 h-24 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-lg font-semibold text-gray-800">{member.name}</div>
                <div className="text-sm font-semibold text-gray-600">NIM: {member.nim}</div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
