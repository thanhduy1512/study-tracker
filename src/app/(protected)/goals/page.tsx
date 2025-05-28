'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type DBGoal = {
  id: string;
  title: string;
  deadline: string;
  created_by: string;
  profiles?: { full_name?: string }[];
};

type Goal = DBGoal & {
  creator_name: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      const { data, error } = await supabase
        .from('goals')
        .select('id, title, deadline, created_by, profiles(full_name)');

      if (error) {
        console.error('Failed to fetch goals:', error.message);
      } else {
        const formatted: Goal[] = data.map((g: DBGoal) => ({
          ...g,
          creator_name: g.profiles?.[0]?.full_name ?? 'Unknown',
        }));

        setGoals(formatted);
      }

      setLoading(false);
    };

    fetchGoals();
  }, []);

  if (loading) return <p className='p-4'>Loading goals...</p>;

  return (
    <main className='p-6 space-y-6 max-w-xl mx-auto'>
      <h1 className='text-2xl font-bold'>📌 Study Goals</h1>
      {goals.length === 0 && (
        <p className='text-gray-500'>No goals yet. Try adding one!</p>
      )}
      <ul className='space-y-4'>
        {goals.map((goal) => (
          <li
            key={goal.id}
            className='p-4 border rounded-lg shadow hover:bg-gray-50'
          >
            <Link href={`/goals/${goal.id}`}>
              <div className='font-semibold text-lg'>{goal.title}</div>
              <div className='text-sm text-gray-500'>
                Deadline: {goal.deadline}
                <br />
                Created by: {goal.creator_name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
