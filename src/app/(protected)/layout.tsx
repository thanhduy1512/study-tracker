'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FooterNav from '@/components/FooterNav';
import Header from '@/components/Header';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return <p className='p-6'>Checking auth...</p>;

  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <Header />
      <main className='flex-1 overflow-y-auto'>{children}</main>
      <FooterNav />
    </div>
  );
}
