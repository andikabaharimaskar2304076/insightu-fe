'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CalendarIcon, UserIcon, MessageSquareIcon, LayoutDashboardIcon } from 'lucide-react';

export default function PsychologistLayout({ children }: { children: React.ReactNode }) {
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
            href="/dashboard/psychologist"
            className={cn(
              'flex items-center gap-2 hover:text-[#4380f0]',
              pathname === '/dashboard/psychologist' && 'text-[#4380f0] font-bold'
            )}
          >
            <LayoutDashboardIcon size={16} /> Dashboard
          </Link>
          <Link
            href="/dashboard/psychologist/profile"
            className={cn(
              'flex items-center gap-2 hover:text-[#4380f0]',
              pathname === '/dashboard/psychologist/profile' && 'text-[#4380f0] font-bold'
            )}
          >
            <UserIcon size={16} /> Profile
          </Link>
          <Link
            href="/dashboard/psychologist/sessions"
            className={cn(
              'flex items-center gap-2 hover:text-[#4380f0]',
              pathname === '/dashboard/psychologist/sessions' && 'text-[#4380f0] font-bold'
            )}
          >
            <CalendarIcon size={16} /> Sessions
          </Link>
          <Link
            href="/dashboard/psychologist/messages"
            className={cn(
              'flex items-center gap-2 hover:text-[#4380f0]',
              pathname === '/dashboard/psychologist/messages' && 'text-[#4380f0] font-bold'
            )}
          >
            <MessageSquareIcon size={16} /> Messages
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
            {pathname.includes('/sessions') ? 'Counseling Sessions' : pathname.includes('/profile') ? 'Psychologist Profile' : 'Dashboard'}
          </h2>
          <div className="w-10 h-10 relative rounded-full overflow-hidden border">
            <img
              src="/images/default-avatar.png"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </header>


        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}