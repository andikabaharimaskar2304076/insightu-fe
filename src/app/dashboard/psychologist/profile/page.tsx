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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const psychologistProfileSchema = z.object({
  license_number: z.string(),
  specialization: z.string(),
  years_of_experience: z.string(),
  consultation_fee: z.string(),
});

type PsychologistProfileSchema = z.infer<typeof psychologistProfileSchema>;

export default function PsychologistProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<PsychologistProfileSchema>({
    resolver: zodResolver(psychologistProfileSchema),
    defaultValues: {
      license_number: '',
      specialization: '',
      years_of_experience: '',
      consultation_fee: '',
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
        years_of_experience: data.years_of_experience || '',
        consultation_fee: data.consultation_fee || '',
      });
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
      await fetchProfile();
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
            {['license_number', 'specialization', 'years_of_experience', 'consultation_fee'].map((fieldName) => (
              <FormField
                key={fieldName}
                name={fieldName as keyof PsychologistProfileSchema}
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
  );
}
