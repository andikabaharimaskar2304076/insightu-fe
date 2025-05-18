'use client';

export default function PsychologistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-blue-900 text-white p-4">Psikolog Sidebar</aside>
      <main className="flex-1">
        <header className="bg-blue-600 text-white p-4">Psychologist Dashboard</header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}