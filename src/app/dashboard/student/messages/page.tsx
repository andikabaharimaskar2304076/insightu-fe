'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type ChatPsychologist = {
  id: string;
  username: string;
};

export default function MessagePage() {
  const [psychologists, setPsychologists] = useState<ChatPsychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const router = useRouter();

  const checkVerification = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/me/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      if (!data.is_verified) {
        setVerified(false);
      } else {
        setVerified(true);
      }
    } catch (err) {
      console.error('Failed to verify student', err);
      setVerified(false);
    }
  };

  const fetchAcceptedPsychologists = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/my-sessions/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();

      const accepted = data.filter((s: any) => s.status === 'accepted');
      const uniquePsychologists: Record<string, ChatPsychologist> = {};

      accepted.forEach((s: any) => {
        const p = s.psychologist_info;
        if (p && !uniquePsychologists[p.id]) {
          uniquePsychologists[p.id] = p;
        }
      });

      setPsychologists(Object.values(uniquePsychologists));
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerification().then(() => {
      fetchAcceptedPsychologists();
    });
  }, []);

  if (loading || verified === null) return <div>Loading...</div>;

  if (!verified) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded">
        <h2 className="text-xl font-bold mb-2">Akun Belum Terverifikasi</h2>
        <p>Silakan lengkapi dan verifikasi profil Anda terlebih dahulu untuk mengakses fitur percakapan.</p>
        <button
          onClick={() => router.push('/dashboard/student/profile')}
          className="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
        >
          Lengkapi Profil & Verifikasi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Your Conversations</h2>
      {psychologists.length === 0 ? (
        <p className="text-gray-500">Belum ada sesi yang diterima.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {psychologists.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/student/messages/${p.id}`}
              className="border p-4 rounded shadow-sm hover:shadow-md transition bg-white"
            >
              <h3 className="font-bold text-lg">{p.username}</h3>
              <p className="text-sm text-blue-600">Click to open chat</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
