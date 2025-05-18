'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-800 text-white p-4">Admin Sidebar</aside>
      <main className="flex-1">
        <header className="bg-gray-600 text-white p-4">Admin Dashboard</header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}