'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const psychologistProfileSchema = z.object({
  license_number: z.string(),
  specialization: z.string(),
  biography: z.string(),
});

type PsychologistProfileSchema = z.infer<typeof psychologistProfileSchema>;

export default function PsychologistProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<PsychologistProfileSchema>({
    resolver: zodResolver(psychologistProfileSchema),
    defaultValues: {
      license_number: '',
      specialization: '',
      biography: '',
    },
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/psychologist-profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      const data = await res.json();
      form.reset({
        license_number: data.license_number || '',
        specialization: data.specialization || '',
        biography: data.biography || '',
      });
      setIsVerified(data.is_verified);
      setIsComplete(data.is_complete);

      if (data.address_avatar?.startsWith('http')) {
        setPreview(data.address_avatar);
      } else if (data.address_avatar?.startsWith('/media')) {
        setPreview(`http://127.0.0.1:8000${data.address_avatar}`);
      } else {
        setPreview('/images/default-avatar.png');
      }
    } catch (error) {
      console.error('Failed to load psychologist profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [form]);

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/users/upload-avatar/', {
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

  const onSubmit = async (values: PsychologistProfileSchema) => {
    setLoading(true);
    try {
      await uploadAvatar();
      const res = await fetch('http://localhost:8000/api/v1/psychologist-profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        alert('Profile updated successfully');
        fetchProfile();
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

  const handleVerification = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/psychologist-profile/verify/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      if (res.ok) {
        alert('Akun berhasil diverifikasi!');
        fetchProfile();
      } else {
        const errText = await res.text();
        alert('Gagal verifikasi: ' + errText);
      }
    } catch (err) {
      console.error('Verifikasi error:', err);
    }
  };

  return (
    <div className="w-full ml-1 mr-24 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold">Psychologist Profile</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border">
              <Image
                src={preview || '/images/default-avatar.png'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <FormItem className="flex-1">
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

          <div className="flex flex-col gap-4">
            {['license_number', 'specialization', 'biography'].map((fieldName) => (
              <FormField
                key={fieldName}
                name={fieldName as keyof PsychologistProfileSchema}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{fieldName.replace('_', ' ')}</FormLabel>
                    <FormControl>
                      {fieldName === 'biography' ? (
                        <textarea {...field} className="w-full p-2 border rounded" rows={4} />
                      ) : (
                        <Input {...field} />
                      )}
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

      {!isVerified && isComplete && (
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleVerification}
        >
          Verifikasi Akun
        </Button>
      )}
      {!isVerified && !isComplete && (
        <p className="text-sm text-red-600 text-center">
          Lengkapi semua data untuk bisa verifikasi akun.
        </p>
      )}
    </div>
  );
}
