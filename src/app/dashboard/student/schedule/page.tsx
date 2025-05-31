'use client';

import { useEffect, useState } from 'react';

// Tipe data untuk Psikolog dan Jadwal
type Psychologist = {
  id: string; // ini ID dari PsychologistProfile
  user_id: string; // ID dari User yang digunakan untuk booking
  username: string;
  specialization: string;
  biography: string;
  avatar: string;
  availabilities: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
};

export default function SchedulePage() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');

  // Fetch data dari API
  useEffect(() => {
    const fetchPsychologists = async () => {
      const res = await fetch('http://localhost:8000/api/v1/psychologists-with-availability/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      setPsychologists(data);
    };
    fetchPsychologists();
  }, []);

  // Submit permintaan sesi
  const handleBooking = async () => {
    if (!selectedPsychologist || !date || !purpose) {
      alert('Please complete all fields');
      return;
    }

    const res = await fetch('http://localhost:8000/api/v1/sessions/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        psychologist: selectedPsychologist, // harus ID dari User
        schedule_time: new Date(date).toISOString(),
        notes: purpose,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert('Session requested successfully!');
      setSelectedPsychologist('');
      setDate('');
      setPurpose('');
    } else {
      alert('Error: ' + JSON.stringify(result));
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6">
      {/* Panel Kiri */}
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Available Counselors</h2>
        {psychologists.map((p) => (
          <div key={p.user_id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {p.avatar ? (
                <img
                  src={p.avatar.startsWith('http') ? p.avatar : `http://localhost:8000${p.avatar}`}
                  alt={p.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200" />
              )}
              <div>
                <div className="font-bold text-lg">{p.username}</div>
                <div className="text-sm text-blue-600">{p.specialization}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic mt-2">{p.biography}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.availabilities?.map((a, i) => (
                <div
                  key={i}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs border border-blue-300"
                >
                  {a.day_of_week?.slice(0, 3) || '-'} {a.start_time?.slice(0, 5) || '-'}–{a.end_time?.slice(0, 5) || '-'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Panel Kanan */}
      <div className="md:w-1/2 bg-white p-6 rounded shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Book Your Session</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Counselor:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedPsychologist}
            onChange={(e) => setSelectedPsychologist(e.target.value)}
          >
            <option value="">-- Select Psychologist --</option>
            {psychologists.map((p) => (
              <option key={p.user_id} value={p.user_id}>
                {p.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Date & Time:</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Session Purpose:</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
