'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function PsychologistHistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
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

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:8000/api/v1/my-sessions/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const history = res.data.filter((s: any) =>
        ['accepted', 'rejected', 'completed'].includes(s.status)
      );
      setSessions(history);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (sessionId: string) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/update-status/${sessionId}/`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      setSuccessMessage('Sukses..! Data Berhasil Di Update...');
      fetchSessions();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Failed to mark as completed:', err);
    }
  };

  useEffect(() => {
    checkVerification().then(() => {
      fetchSessions();
    });
  }, []);

  if (loading || verified === null) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (sessions.length === 0)
    return <div className="text-center text-lg">Belum ada riwayat sesi.</div>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-primary mb-3">
        Riwayat Sesi Konseling
      </h2>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Sukses..! </strong>
          <span className="block sm:inline">{successMessage}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setSuccessMessage('')}
          >
            <svg
              className="fill-current h-6 w-6 text-green-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 5.652a1 1 0 00-1.414-1.414L10 7.172 7.066 4.238a1 1 0 10-1.414 1.414L8.828 10l-3.176 3.176a1 1 0 101.414 1.414L10 12.828l2.934 2.934a1 1 0 001.414-1.414L11.172 10l3.176-3.176z" />
            </svg>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((s, i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <CardTitle>Sesi Konseling</CardTitle>
              <CardDescription>
                Dijadwalkan: {dayjs(s.schedule_time).format('dddd, D MMMM YYYY HH:mm')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>Student</Label>
                  <div>{s.student?.username || s.student_username || '-'}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="font-medium capitalize">{s.status}</div>
                </div>
                <div>
                  <Label>Catatan</Label>
                  <div>{s.notes || '-'}</div>
                </div>
                {s.status === 'accepted' && (
                  <Button
                    variant="default"
                    className="mt-3"
                    onClick={() => markCompleted(s.id)}
                  >
                    Tandai Selesai
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
