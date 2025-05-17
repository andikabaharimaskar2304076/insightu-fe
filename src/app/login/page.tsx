'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, login } from '@/lib/api';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const data = await login(email, password); // ⬅️ data didefinisikan di sini

    // Simpan ke localStorage (untuk client-side use)
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);

    // Simpan ke cookie (untuk middleware Next.js)
    document.cookie = `access=${data.access}; path=/`;

    // Lanjut ke dashboard sesuai role
    const user = await getMe(data.access);

    if (user.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (user.role === 'student') {
      router.push('/dashboard/student');
    } else {
      router.push('/dashboard/psychologist');
    }
  } catch (err: any) {
    setError(err.message || 'Login gagal');
  }
};


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Masuk ke InsightU</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </main>
  );
}
