'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ChatStudent = {
  id: string;
  username: string;
};

export default function MessagePage() {
  const [students, setStudents] = useState<ChatStudent[]>([]);
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
        router.push('/dashboard/psychologist/profile');
      } else {
        setVerified(true);
      }
    } catch (err) {
      console.error('Failed to verify psychologist', err);
      setVerified(false);
    }
  };

  const fetchAcceptedSessions = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/my-sessions/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      const accepted = data.filter((s: any) => s.status === 'accepted');

      const uniqueStudents: Record<string, ChatStudent> = {};
      accepted.forEach((s: any) => {
        const student = s.student;
        if (student && !uniqueStudents[student.id]) {
          uniqueStudents[student.id] = student;
        }
      });

      setStudents(Object.values(uniqueStudents));
    } catch (err) {
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerification().then(() => {
      fetchAcceptedSessions();
    });
  }, []);

  if (loading || verified === null) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Student Conversations</h2>
      {students.length === 0 ? (
        <p className="text-gray-500">No accepted sessions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/psychologist/messages/${s.id}`}
              className="border p-4 rounded shadow-sm hover:shadow-md transition bg-white"
            >
              <h3 className="font-bold text-lg">{s.username}</h3>
              <p className="text-sm text-blue-600">Click to chat</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
