'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'psychologist';
  psychologist_profile?: {
    license_number: string;
    specialization: string;
    biography: string;
  };
  student_profile?: {
    nisn: string;
    gender: string;
    major: string;
    homeroom_teacher: string;
  };
};

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchVerificationList = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/admin/verifications/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error('Gagal mengambil daftar user untuk diverifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/verify/${userId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (!res.ok) throw new Error('Verifikasi gagal');
      toast.success('Akun berhasil diverifikasi');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      toast.error('Gagal memverifikasi akun');
    }
  };

  useEffect(() => {
    fetchVerificationList();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Verifikasi Pengguna</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">Tidak ada pengguna yang perlu diverifikasi.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg shadow p-4 bg-white space-y-2">
              <h3 className="text-lg font-semibold">{user.username}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm font-medium text-blue-700 capitalize">Role: {user.role}</p>

              {user.role === 'psychologist' && user.psychologist_profile && (
                <div className="text-sm text-gray-700 space-y-1 mt-2">
                  <p><strong>License:</strong> {user.psychologist_profile.license_number}</p>
                  <p><strong>Specialization:</strong> {user.psychologist_profile.specialization}</p>
                  <p><strong>Biography:</strong> {user.psychologist_profile.biography}</p>
                </div>
              )}

              {user.role === 'student' && user.student_profile && (
                <div className="text-sm text-gray-700 space-y-1 mt-2">
                  <p><strong>NISN:</strong> {user.student_profile.nisn}</p>
                  <p><strong>Gender:</strong> {user.student_profile.gender}</p>
                  <p><strong>Major:</strong> {user.student_profile.major}</p>
                  <p><strong>Homeroom:</strong> {user.student_profile.homeroom_teacher}</p>
                </div>
              )}

              <Button
                onClick={() => handleVerify(user.id)}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Verifikasi Akun
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
