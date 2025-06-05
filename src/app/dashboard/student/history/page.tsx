'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Session = {
  id: string;
  schedule_time: string;
  notes: string;
  status: string;
  psychologist_info?: {
    id: string;
    username: string;
  };
};

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
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
      console.error('Failed to verify user', err);
      setVerified(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/sessions/history/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch session history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerification().then(() => {
      fetchHistory();
    });
  }, []);

  if (loading || verified === null) return <div>Loading...</div>;

  if (!verified) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded">
        <h2 className="text-xl font-bold mb-2">Akun Belum Terverifikasi</h2>
        <p>Silakan lengkapi profil Anda terlebih dahulu sebelum melihat riwayat sesi.</p>
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
      <h2 className="text-2xl font-semibold text-gray-800">Session History</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No session history available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <div>
                  <div className="text-md font-semibold">
                    {session.psychologist_info?.username || 'Unknown Psychologist'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(session.schedule_time).toLocaleString()}
                  </div>
                </div>
                <div
                  className={`text-sm font-semibold capitalize ${
                    session.status === 'pending'
                      ? 'text-yellow-600'
                      : session.status === 'accepted'
                      ? 'text-blue-600'
                      : session.status === 'completed'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {session.status}
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">{session.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
