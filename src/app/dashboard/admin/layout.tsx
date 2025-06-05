'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  UsersIcon,
  ShieldCheckIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboardIcon,
  },
  {
    label: 'Verifikasi',
    href: '/dashboard/admin/verification',
    icon: ShieldCheckIcon,
  },
  {
    label: 'Users',
    href: '/dashboard/admin/users',
    icon: UsersIcon,
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-gray-700 text-white font-semibold'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-700 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
          >
            <LogOutIcon size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
