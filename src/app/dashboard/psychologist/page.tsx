'use client';

import { CalendarIcon, ClockIcon, MessageSquareIcon, PlusCircleIcon, Undo2Icon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const psychologistAvailability = z.object({
  // id: z.string().uuid(), // UUIDField = string berbentuk UUID
  // psychologist: z.string().uuid(), // ForeignKey to UUIDField (juga UUID)
  day_of_week: z.enum([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]), // enum dari pilihan hari
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'Start time must be in HH:MM or HH:MM:SS format',
  }), // TimeField = format waktu
  end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'End time must be in HH:MM or HH:MM:SS format',
  }),
});

type PsychologistAvailability = z.infer<typeof psychologistAvailability>;

export default function PsychologistDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const form = useForm<PsychologistAvailability>({
    resolver: zodResolver(psychologistAvailability),
    defaultValues: {
      // id: crypto.randomUUID(),
      // psychologist: '',
      day_of_week: 'Monday',
      start_time: '00:00',
      end_time: '00:00',
    },
  });

  const fetchAvailability = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/availabilities/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      form.reset({
        // id: data.id || crypto.randomUUID(),
        // psychologist: data.psychologist || '',
        // day_of_week: data.day_of_week || 'Monday',
        // start_time: data.start_time || '00:00',
        // end_time: data.end_time || '00:00',
        // id: data.id,
        // psychologist: data.psychologist,
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
      });
    } catch (error) {
      console.error('Failed to load psychologist schedule:', error);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [form]);

  const onSubmit = async (values: PsychologistAvailability) => {
    setLoading(true);
    try {
      await fetchAvailability();
      const res = await fetch('http://localhost:8000/api/v1/availabilities/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        alert('Availability updated successfully');
      } else {
        const error = await res.text();
        alert('Failed to update availability: ' + error);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard Psikolog</h2>
          <p className="text-gray-600">Halo, Sandy</p>
        </div>

      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Session Requests */}
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

        {/* Quick Actions */}
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

      {/* Today's Sessions */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Today's Sessions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">9:00 AM</p>
            <p className="text-sm text-gray-600">John Smith</p>
            <p className="text-xs text-gray-500">Career Guidance</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">10:00 AM</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">11:00 AM</p>
            <p className="text-sm text-gray-600">Emma Wilson</p>
            <p className="text-xs text-gray-500">Academic Support</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">12:00 PM</p>
            <p className="text-sm text-gray-600">Lunch Break</p>
          </div>
        </div>
      </div>

      {/* My Available Schedule */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">My Available Schedule</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4">
              {['day_of_week', 'start_time', 'end_time'].map((fieldName) => (
                
                <FormField
                  key={fieldName}
                  name={fieldName as keyof PsychologistAvailability}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{fieldName.replace('_', ' ')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
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
