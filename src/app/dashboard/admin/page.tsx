'use client';
import withAuth from '@/lib/withAuth';

type Props = {
  user?: any;
};

function AdminDashboard({ user }: Props) {
  if (!user) return null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
      <p className="mt-2 text-gray-600">Halo, {user.username}</p>
    </main>
  );
}

export default withAuth(AdminDashboard, ['admin']);