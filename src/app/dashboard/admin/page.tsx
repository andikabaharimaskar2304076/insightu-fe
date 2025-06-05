'use client';

import { useEffect, useState } from 'react';
import { UsersIcon, UserCheckIcon, UserIcon, CalendarClockIcon } from 'lucide-react';

type Stats = {
  total_users: number;
  total_students: number;
  total_psychologists: number;
  total_sessions: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/admin/stats/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) return <div className="p-6">Loading...</div>;

  const card = (title: string, value: number, Icon: any, color: string) => (
    <div className="bg-white border rounded-lg shadow p-4 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {card('Total Users', stats.total_users, UsersIcon, 'bg-blue-500')}
        {card('Students', stats.total_students, UserIcon, 'bg-green-500')}
        {card('Psychologists', stats.total_psychologists, UserCheckIcon, 'bg-purple-500')}
        {card('Total Sessions', stats.total_sessions, CalendarClockIcon, 'bg-orange-500')}
      </div>
    </div>
  );
}
