'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
    birth_date: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, password, role, birth_date } = form;
    const payload = {
      username,
      email,
      password,
      role,
      ...(role === 'student' && { birth_date }),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error:", errorData);
        alert(`Gagal registrasi:\n${JSON.stringify(errorData, null, 2)}`);
        return;
      }

      router.push('/login');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat registrasi');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-4xl bg-[#4380f0] rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 p-8 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">InsightU</h1>
          <p className="mb-6 text-lg">Daftarkan akunmu untuk memulai sesi konseling dengan InsightU.</p>
          <Image src="/images/welcome-register.png" alt="Welcome" width={400} height={300} className="rounded-lg" />
        </div>
        <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center text-[#4380f0] mb-2">Register</h2>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md"
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md"
          >
            <option value="student">Siswa</option>
            <option value="psychologist">Psikolog</option>
          </select>
          {form.role === 'student' && (
            <input
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          )}
          <button
            type="submit"
            className="bg-[#4380f0] text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Sudah punya akun? <Link href="/login" className="text-[#4380f0] font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}