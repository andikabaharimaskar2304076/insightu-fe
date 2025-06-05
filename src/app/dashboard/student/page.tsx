'use client';

import { useEffect, useState } from 'react';
import withAuth from '@/lib/withAuth';
import { useRouter } from 'next/navigation';

// Type Definitions
interface Session {
  id: string;
  schedule_time: string;
  notes: string;
  status: string;
  psychologist_info?: {
    id: string;
    username: string;
  };
}

interface Availability {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

function StudentDashboard({ user }: { user?: any }) {
  const router = useRouter();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        const data = await res.json();
        setIsVerified(data.is_verified);

        const avatarPath = data.address_avatar;
        if (avatarPath?.startsWith('/media')) {
          setAvatar(`http://localhost:8000${avatarPath}`);
        } else if (avatarPath?.startsWith('http')) {
          setAvatar(avatarPath);
        } else {
          setAvatar(null);
        }
      } catch (err) {
        console.error('Failed to fetch student profile:', err);
        router.push('/login');
      }
    };

    const fetchSessions = async () => {
      const res = await fetch('http://localhost:8000/api/v1/sessions/history/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      setSessions(data);
    };

    const fetchAvailabilities = async () => {
      const res = await fetch('http://localhost:8000/api/v1/psychologists-with-availability/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      const allAvailabilities = data.flatMap((p: any) => p.availabilities);
      setAvailabilities(allAvailabilities);
    };

    fetchProfile();
    fetchSessions();
    fetchAvailabilities();
  }, [router]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const avatarUrl = avatar || '/images/default-avatar.png';

  if (!isVerified) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded">
        <h2 className="text-xl font-bold mb-2">Akun Belum Terverifikasi</h2>
        <p>Silakan lengkapi profil Anda untuk mengakses dashboard siswa.</p>
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
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="flex items-center gap-4">
        <h3 className="text-lg font-semibold">Selamat datang kembali, {user?.username || 'User'}!</h3>
      </section>

      {/* Session History */}
      <section>
        <h3 className="bg-[#4380f0] text-white px-4 py-2 rounded-t-md font-semibold text-base">Session History</h3>
        <div className="bg-white border border-[#4380f0] p-4 space-y-4">
          {sessions.length === 0 ? (
            <p className="text-gray-500">Belum ada sesi yang dilakukan.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold">{s.psychologist_info?.username || 'Unknown Psychologist'}</p>
                <p className="text-sm text-gray-600">
                  {new Date(s.schedule_time).toLocaleDateString()} - {new Date(s.schedule_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm italic text-gray-600">{s.notes || '-'}</p>
                <span className={`text-xs mt-1 inline-block px-2 py-1 rounded font-medium ${
                  s.status === 'pending'
                    ? 'bg-yellow-200 text-yellow-800'
                    : s.status === 'accepted'
                    ? 'bg-blue-200 text-blue-800'
                    : s.status === 'completed'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {s.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Available Counselor Schedules */}
      <section>
        <h3 className="bg-[#4380f0] text-white px-4 py-2 rounded-t-md font-semibold text-base">Available Counselor Schedules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 p-4 border border-[#4380f0]">
          {shortDays.map((shortDay, i) => (
            <div
              key={shortDay}
              className="bg-gray-200 h-20 rounded-md flex flex-col items-center justify-center font-medium"
            >
              {shortDay}
              <div className="text-xs font-normal mt-1 text-gray-600">
                {
                  availabilities
                    .filter((a) => a.day_of_week === days[i])
                    .map((a, idx) => (
                      <div key={idx}>{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</div>
                    ))
                }
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default withAuth(StudentDashboard, ['student']);
