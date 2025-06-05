'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function AlertBox({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong className="font-bold">Sukses..! </strong>
      <span className="block sm:inline">{message}</span>
      <span onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 5.652a1 1 0 00-1.414-1.414L10 7.172 7.066 4.238a1 1 0 10-1.414 1.414L8.828 10l-3.176 3.176a1 1 0 101.414 1.414L10 12.828l2.934 2.934a1 1 0 001.414-1.414L11.172 10l3.176-3.176z"/></svg>
      </span>
    </div>
  );
}

type Availability = {
  day_of_week: string;
  start_time: string;
  end_time: string;
};

type Psychologist = {
  id: string;
  user_id: string;
  username: string;
  specialization: string;
  biography: string;
  avatar: string;
  availabilities: Availability[];
};

function getTimeSlots(start: string, end: string): string[] {
  const result: string[] = [];
  const [sh] = start.split(':').map(Number);
  const [eh] = end.split(':').map(Number);
  for (let h = sh; h <= eh; h++) {
    result.push(h.toString().padStart(2, '0') + ':00');
  }
  return result;
}

export default function SchedulePage() {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/me/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
        });
        const data = await res.json();
        setIsVerified(data.is_verified === true);
      } catch (err) {
        console.error('Verification error:', err);
        setIsVerified(false);
      } finally {
        setChecking(false);
      }
    };
    checkVerification();
  }, []);

  useEffect(() => {
    const fetchPsychologists = async () => {
      const res = await fetch('http://localhost:8000/api/v1/psychologists-with-availability/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      const data = await res.json();
      const filtered = data.filter((p: Psychologist) => p.availabilities?.length > 0);
      setPsychologists(filtered);
    };
    fetchPsychologists();
  }, []);

  useEffect(() => {
    const selected = psychologists.find((p) => p.user_id === selectedPsychologist);
    setSelectedAvailability(selected?.availabilities || []);
    setSelectedDate('');
    setAvailableTimes([]);
    setSelectedTime('');
    setTakenSlots([]);
  }, [selectedPsychologist]);

  useEffect(() => {
    if (!selectedDate || !selectedPsychologist) return;
    const fetchTaken = async () => {
      const res = await fetch('http://localhost:8000/api/v1/my-sessions/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      const data = await res.json();
      const filtered = data.filter((s: any) =>
        s.psychologist?.id === selectedPsychologist &&
        s.schedule_time.startsWith(selectedDate)
      );
      const times = filtered.map((s: any) => new Date(s.schedule_time).toTimeString().slice(0, 5));
      setTakenSlots(times);
    };
    fetchTaken();
  }, [selectedDate, selectedPsychologist]);

  useEffect(() => {
    if (!selectedDate || selectedAvailability.length === 0) return;
    const date = new Date(selectedDate);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const slots: string[] = [];
    selectedAvailability
      .filter((a) => a.day_of_week === dayOfWeek)
      .forEach((a) => {
        slots.push(...getTimeSlots(a.start_time.slice(0, 5), a.end_time.slice(0, 5)));
      });
    setAvailableTimes(slots);
  }, [selectedDate, selectedAvailability]);

  const handleBooking = async () => {
    if (!selectedPsychologist || !selectedDate || !selectedTime || !purpose) {
      alert('Please complete all fields');
      return;
    }

    const datetimeISO = new Date(`${selectedDate}T${selectedTime}`).toISOString();

    const res = await fetch('http://localhost:8000/api/v1/sessions/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
      body: JSON.stringify({
        psychologist: selectedPsychologist,
        schedule_time: datetimeISO,
        notes: purpose,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setSuccessMessage('Data Berhasil Di Update...');
      setTimeout(() => setSuccessMessage(''), 4000);
      setSelectedPsychologist('');
      setSelectedDate('');
      setSelectedTime('');
      setPurpose('');
    } else {
      alert('Error: ' + JSON.stringify(result));
    }
  };

  if (checking) return <div>Loading...</div>;

  if (!isVerified) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded">
        <h2 className="text-xl font-bold mb-2">Akun Belum Terverifikasi</h2>
        <p>Untuk mengakses halaman ini, silakan lengkapi profil Anda dan tunggu proses verifikasi.</p>
        <button
          onClick={() => router.push('/dashboard/student/profile')}
          className="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
        >
          Lengkapi Profil & Verifikasi
        </button>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col md:flex-row gap-10 p-6">
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Available Counselors</h2>
        {psychologists.map((p) => (
          <div key={p.user_id} className="p-4 border rounded bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={
                  p.avatar
                    ? (p.avatar.startsWith('http') ? p.avatar : `http://localhost:8000${p.avatar}`)
                    : '/images/default-avatar.png'
                }
                alt={p.username}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="font-bold text-lg">{p.username}</div>
                <div className="text-sm text-blue-600">{p.specialization}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic mt-2">{p.biography}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.availabilities.map((a, i) => (
                <div key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs border border-blue-300">
                  {a.day_of_week.slice(0, 3)} {a.start_time.slice(0, 5)}–{a.end_time.slice(0, 5)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="md:w-1/2 bg-white p-6 rounded shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Book Your Session</h2>

        {successMessage && <AlertBox message={successMessage} onClose={() => setSuccessMessage('')} />}

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
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!selectedPsychologist}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Time:</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
          >
            <option value="">-- Select Time --</option>
            {availableTimes.map((time, i) => (
              <option key={i} value={time} disabled={takenSlots.includes(time)}>
                {time}
              </option>
            ))}
          </select>
          {takenSlots.includes(selectedTime) && selectedTime && (
            <p className="text-sm text-red-600 mt-1">Waktu ini sudah dipilih oleh siswa lain.</p>
          )}
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
