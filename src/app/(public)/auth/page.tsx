'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    setError('');
    const method = isRegister ? 'signUp' : 'signInWithPassword';

    const { error } = await supabase.auth[method]({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/goals');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace('/goals');
      }
    };

    checkSession();
  }, [router]);

  return (
    <main className='flex min-h-screen items-center justify-center p-6'>
      <div className='w-full max-w-sm border p-6 rounded-xl shadow space-y-4'>
        <h1 className='text-xl font-bold text-center'>
          {isRegister ? 'Register' : 'Login'}
        </h1>

        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border p-2 rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border p-2 rounded'
        />

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <button
          onClick={handleAuth}
          className='w-full bg-blue-600 text-white py-2 rounded'
        >
          {isRegister ? 'Create account' : 'Login'}
        </button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className='text-sm text-center w-full text-blue-600'
        >
          {isRegister
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </button>
      </div>
    </main>
  );
}
