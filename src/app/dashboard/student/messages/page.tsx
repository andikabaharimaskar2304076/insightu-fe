'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Tipe data untuk psychologist yang punya sesi "accepted"
type ChatPsychologist = {
  id: string;
  username: string;
};

export default function MessagePage() {
  const [psychologists, setPsychologists] = useState<ChatPsychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAcceptedPsychologists = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/my-sessions/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        const data = await res.json();

        // Filter hanya sesi yang di-accept dan ambil ID psikolog unik
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

    fetchAcceptedPsychologists();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Your Conversations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : psychologists.length === 0 ? (
        <p className="text-gray-500">No accepted sessions yet.</p>
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
