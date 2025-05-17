'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from './api';

export default function withAuth<P extends { user?: any }>(
  Component: React.ComponentType<P>,
  allowedRoles: string[]
) {
  return function ProtectedPage(props: Omit<P, 'user'>) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
      const access = localStorage.getItem('access');
      console.log('access token?', access);
      if (!access) {
        console.log('Redirect to login');
        router.replace('/login');
        return;
      }

      getMe(access)
        .then((data) => {
          if (!allowedRoles.includes(data.role)) {
            router.replace(`/dashboard/${data.role}`);
          } else {
            setUser(data);
            setLoading(false);
          }
        })
        .catch(() => {
          router.replace('/login');
        });
    }, [router]);

    if (loading) {
      return <div className="p-8 text-center">Memuat...</div>;
    }

    return <Component {...(props as P)} user={user} />;
  };
}
