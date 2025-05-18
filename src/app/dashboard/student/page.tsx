'use client';

import withAuth from '@/lib/withAuth';
import Image from 'next/image';

function StudentDashboard({ user }: { user?: any }) {
  const avatarUrl = user?.avatar || '/images/default-avatar.png';

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="flex items-center gap-4">
        <Image src={avatarUrl} alt="User Avatar" width={48} height={48} className="rounded-full object-cover" />
        <h3 className="text-lg font-semibold">Selamat datang kembali, {user?.username || 'User'}!</h3>
      </section>

      {/* Session Requests */}
      <section>
        <h3 className="bg-[#4380f0] text-white px-4 py-2 rounded-t-md font-semibold text-base">Session Request</h3>
        <div className="bg-white border border-[#4380f0] p-4 space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-semibold">Academic Advising Session</p>
            <p className="text-sm text-gray-600">March 20, 2025 - 3:30 PM</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="font-semibold">Academic Advising Session</p>
            <p className="text-sm text-gray-600">March 13, 2025 - 2:00 PM</p>
          </div>
        </div>
      </section>

      {/* Available Schedule */}
      <section>
        <h3 className="bg-[#4380f0] text-white px-4 py-2 rounded-t-md font-semibold text-base">Available Counselor Schedules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4 p-4 border border-[#4380f0]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="bg-gray-200 h-20 rounded-md flex items-center justify-center font-medium">
              {day}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default withAuth(StudentDashboard, ['student']);
