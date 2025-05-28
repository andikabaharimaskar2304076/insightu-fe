'use client';

import {
  CalendarIcon, ClockIcon, MessageSquareIcon,
  PlusCircleIcon, Undo2Icon, UserIcon, Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
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

function AlertBox({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong className="font-bold">Sukses..! </strong>
      <span className="block sm:inline">{message}</span>
      <span onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"><title>Close</title><path d="M14.348 5.652a1 1 0 00-1.414-1.414L10 7.172 7.066 4.238a1 1 0 10-1.414 1.414L8.828 10l-3.176 3.176a1 1 0 101.414 1.414L10 12.828l2.934 2.934a1 1 0 001.414-1.414L11.172 10l3.176-3.176z"/></svg>
      </span>
    </div>
  );
}

export default function PsychologistDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      availabilities: []
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'availabilities'
  });

  const fetchAvailabilities = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/availabilities/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      replace(data.map(item => ({ ...item, db_id: item.id })));
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

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
        setSuccessMessage("Jadwal berhasil diperbarui.");
        fetchAvailabilities();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const error = await res.text();
        toast.error("Gagal memperbarui: " + error);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAvailability = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/availabilities/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });

      if (res.ok) {
        setSuccessMessage("Jadwal berhasil dihapus.");
        fetchAvailabilities();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const error = await res.text();
        toast.error("Gagal menghapus: " + error);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard Psikolog</h2>
          <p className="text-gray-600">Halo, Sandy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">New Session Requests</h3>
          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Alex Thompson</p>
                  <p className="text-sm text-gray-600">Requested: Today, 2:30 PM</p>
                  <p className="text-sm text-gray-600">Need to discuss academic stress and time management</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-800">✓</button>
                  <button className="text-red-600 hover:text-red-800">✕</button>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Maria Garcia</p>
                  <p className="text-sm text-gray-600">Requested: Today, 1:15 PM</p>
                  <p className="text-sm text-gray-600">Would like career guidance counseling</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-800">✓</button>
                  <button className="text-red-600 hover:text-red-800">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200">
              <PlusCircleIcon size={16} /> Add Availability
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200">
              <Undo2Icon size={16} /> Session History
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200">
              <MessageSquareIcon size={16} /> Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">My Available Schedule</h3>
        {successMessage && (
          <AlertBox message={successMessage} onClose={() => setSuccessMessage("")} />
        )}
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
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
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
                          <Input type="time" {...field} />
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
                          <Input type="time" {...field} />
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
                          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Jadwal akan dihapus secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteAvailability(item.db_id!)}>
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ day_of_week: 'Monday', start_time: '08:00', end_time: '09:00' })}>
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