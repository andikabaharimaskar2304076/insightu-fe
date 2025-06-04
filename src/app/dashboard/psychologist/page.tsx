'use client';

import {
  MessageSquareIcon, Undo2Icon, Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import axios from 'axios';
import dayjs from 'dayjs';
import withAuth from '@/lib/withAuth';

const availabilitySchema = z.object({
  availabilities: z.array(z.object({
    id: z.string().optional(),
    db_id: z.string().optional(),
    day_of_week: z.enum([
      'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday', 'Sunday'
    ]),
    start_time: z.string(),
    end_time: z.string(),
  }))
});

type AvailabilityFormValues = z.infer<typeof availabilitySchema>;

function PsychologistDashboardPage({ user }: { user?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const isVerified = user?.is_verified ?? false; // ✅ ambil langsung dari user

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { availabilities: [] }
  });

  const { fields, append, replace } = useFieldArray({
    control: form.control,
    name: 'availabilities'
  });

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const fetchAvailabilities = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/availabilities/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      const data = await res.json();
      const formatted = data.map((item: any) => ({
        ...item,
        db_id: item.id,
        start_time: item.start_time.slice(0, 5),
        end_time: item.end_time.slice(0, 5),
      }));
      replace(formatted);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/my-sessions/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` },
      });
      const data = res.data;
      const pending = data.filter((s: any) => s.status === "pending");
      setSessions(pending);
    } catch (err) {
      console.error("Failed to fetch session data", err);
    }
  };

  const updateStatus = async (sessionId: string, status: string) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/update-status/${sessionId}/`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } }
      );
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success(`Status sesi berhasil diperbarui menjadi ${status}.`);
    } catch (err) {
      toast.error("Gagal memperbarui status sesi.");
    }
  };

  const onSubmit = async (values: AvailabilityFormValues) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/availabilities/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify(values.availabilities.map(({ db_id, ...rest }) => rest)),
      });
      if (res.ok) {
        toast.success("Jadwal berhasil diperbarui.");
        fetchAvailabilities();
      } else {
        toast.error("Gagal memperbarui jadwal.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/availabilities/delete/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      });
      if (res.ok) {
        toast.success("Jadwal berhasil dihapus.");
        fetchAvailabilities();
      } else {
        toast.error("Gagal menghapus jadwal.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus.");
    }
  };

  useEffect(() => {
    fetchAvailabilities();
    fetchSessions();
  }, []);

  if (!isVerified) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded">
        <h2 className="text-xl font-bold mb-2">Akun Belum Terverifikasi</h2>
        <p>Untuk mengakses dashboard, silakan lengkapi profil Anda dan lakukan verifikasi.</p>
        <button
          onClick={() => router.push('/dashboard/psychologist/profile')}
          className="mt-4 inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
        >
          Lengkapi Profil & Verifikasi
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard Psikolog</h2>
          <p className="text-gray-600">Halo, {user?.username || 'Psikolog'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Requests */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">New Session Requests</h3>
          <div className="space-y-3">
            {sessions.length === 0 && <p className="text-sm text-gray-500">Tidak ada permintaan sesi baru.</p>}
            {sessions.map((s) => (
              <div key={s.id} className="bg-gray-100 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{s.student?.username || '-'}</p>
                    <p className="text-sm text-gray-600">Requested: {dayjs(s.schedule_time).format("D MMM YYYY, HH:mm")}</p>
                    <p className="text-sm text-gray-600">{s.notes || '-'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-green-600 hover:text-green-800" onClick={() => updateStatus(s.id, 'accepted')}>✓</button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => updateStatus(s.id, 'rejected')}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => router.push('/dashboard/psychologist/history')}>
              <Undo2Icon size={16} /> Session History
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200"
              onClick={() => router.push('/dashboard/psychologist/messages')}>
              <MessageSquareIcon size={16} /> Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">My Available Schedule</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4">
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-4 items-end">
                  <FormField
                    name={`availabilities.${index}.day_of_week`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                              <SelectItem key={day} value={day}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`availabilities.${index}.start_time`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>Start</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Start Time" /></SelectTrigger>
                            <SelectContent>
                              {hours.map(h => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`availabilities.${index}.end_time`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <FormLabel>End</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="End Time" /></SelectTrigger>
                            <SelectContent>
                              {hours.map(h => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {item.db_id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive"> <Trash2 size={16} /> </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                          <AlertDialogDescription>Data jadwal ini akan dihapus permanen.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteAvailability(item.db_id!)}>Ya, hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline"
                onClick={() => append({ day_of_week: 'Monday', start_time: '08:00', end_time: '09:00' })}>
                + Add More
              </Button>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default withAuth(PsychologistDashboardPage, ['psychologist']);