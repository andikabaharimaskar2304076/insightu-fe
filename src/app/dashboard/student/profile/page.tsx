'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const studentProfileSchema = z.object({
  nisn: z.string().min(5),
  homeroom_teacher: z.string(),
  gender: z.enum(['male', 'female']),
  major: z.string(),
  birth_date: z.string(),
  school_name: z.string(),
  grade_level: z.string(),
});

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      nisn: '',
      homeroom_teacher: '',
      gender: 'male',
      major: '',
      birth_date: '',
      school_name: '',
      grade_level: ''
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/student-profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        const data = await res.json();
        form.reset({
          nisn: data.nisn || '',
          homeroom_teacher: data.homeroom_teacher || '',
          gender: data.gender || 'male',
          major: data.major || '',
          birth_date: data.birth_date || '',
          school_name: data.school_name || '',
          grade_level: data.grade_level || '',
        });
        if (data.address_avatar?.startsWith('http')) {
          setPreview(data.address_avatar);
        } else if (data.address_avatar?.startsWith('/media')) {
          setPreview(`http://127.0.0.1:8000${data.address_avatar}`);
        } else {
          setPreview('/images/default-avatar.png');
        }
      } catch (error) {
        console.error('Failed to load student profile:', error);
      }
    };

    fetchProfile();
  }, [form]);

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const res = await fetch('http://localhost:8000/api/v1/users/upload-avatar/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Upload avatar failed');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
    }
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await uploadAvatar();
      const res = await fetch('http://localhost:8000/api/v1/student-profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        alert('Profile updated successfully');
      } else {
        const error = await res.text();
        alert('Failed to update profile: ' + error);
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Student Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border">
              <Image
                src={preview || '/images/default-avatar.png'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <FormItem>
              <FormLabel>Change Avatar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                      setAvatarFile(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            {['nisn', 'homeroom_teacher', 'major', 'birth_date', 'school_name', 'grade_level'].map((fieldName) => (
              <FormField
                key={fieldName}
                name={fieldName as keyof z.infer<typeof studentProfileSchema>}
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

            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
