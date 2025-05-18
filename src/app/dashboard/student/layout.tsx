'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access');
    router.push('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1f2937] text-white flex flex-col px-4 py-6 space-y-6">
        <h1 className="text-lg font-semibold text-white mb-2">InsightU</h1>
        <nav className="space-y-4 text-sm">
          <Link
            href="/dashboard/student"
            className={cn(
              'block hover:text-[#4380f0]',
              pathname === '/dashboard/student' && 'text-[#4380f0] font-bold'
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/student/profile"
            className={cn(
              'block hover:text-[#4380f0]',
              pathname === '/dashboard/student/profile' && 'text-[#4380f0] font-bold'
            )}
          >
            Student Profile
          </Link>
          <Link
            href="/dashboard/student/schedule"
            className={cn(
              'block hover:text-[#4380f0]',
              pathname === '/dashboard/student/schedule' && 'text-[#4380f0] font-bold'
            )}
          >
            Schedule
          </Link>
          <Link
            href="/dashboard/student/messages"
            className={cn(
              'block hover:text-[#4380f0]',
              pathname === '/dashboard/student/messages' && 'text-[#4380f0] font-bold'
            )}
          >
            Messages
          </Link>
          <Link
            href="/dashboard/student/settings"
            className={cn(
              'block hover:text-[#4380f0]',
              pathname === '/dashboard/student/settings' && 'text-[#4380f0] font-bold'
            )}
          >
            Settings
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 text-sm bg-red-500 rounded-md px-4 py-2 text-white hover:bg-red-600"
        >
          Keluar
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white text-gray-800">
        {/* Header */}
        <header className="bg-[#4380f0] text-white flex justify-between items-center px-8 py-4">
          <h2 className="text-xl font-semibold capitalize">
            {pathname.includes('/profile') ? 'Student Profile' : 'Dashboard'}
          </h2>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
