'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export type Task = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  goal_id?: string;
  profiles?: { full_name?: string }[]; // ✅ as array
  task_reactions?: { user_id: string }[];
};

type FormattedTask = Task & {
  reacted_by_me: boolean;
  reactions: number;
};

export default function GoalDetailPage() {
  const { id } = useParams();
  const [goalTitle, setGoalTitle] = useState('');
  const [tasks, setTasks] = useState<FormattedTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;

      setUserId(session.user.id);

      // Fetch goal title
      const { data: goalData } = await supabase
        .from('goals')
        .select('title')
        .eq('id', id)
        .single();

      if (goalData) setGoalTitle(goalData.title);

      // Fetch tasks
      const loadedTasks = await fetchTasks(id as string, session.user.id);
      setTasks(loadedTasks);
      setLoading(false);
    };

    init();
  }, [id]);

  const fetchTasks = useCallback(
    async (goalId: string, currentUserId: string) => {
      console.log(currentUserId);

      const { data, error } = await supabase
        .from('tasks')
        .select(
          `
    id,
    content,
    created_at,
    user_id,
    goal_id,
    profiles(full_name),
    task_reactions!task_reactions_task_id_fkey(user_id)
  `
        )
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch tasks error:', error);
        return [];
      }

      return data.map((t: Task) => ({
        ...t,
        reactions: t.task_reactions?.length ?? 0,
        reacted_by_me:
          t.task_reactions?.some((r) => r.user_id === userId) ?? false,
      }));
    },
    [userId]
  );

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    await supabase.from('tasks').insert({
      goal_id: id,
      user_id: userId,
      content: newTask.trim(),
    });

    setNewTask('');
    const updated = await fetchTasks(id as string, userId);
    setTasks(updated);
  };

  const handleReact = async (taskId: string, reacted: boolean) => {
    if (reacted) {
      await supabase
        .from('task_reactions')
        .delete()
        .eq('task_id', taskId)
        .eq('user_id', userId);
    } else {
      await supabase.from('task_reactions').insert({
        task_id: taskId,
        user_id: userId,
      });
    }

    const updated = await fetchTasks(id as string, userId);
    setTasks(updated);
  };

  if (loading) return <p className='p-4'>Loading...</p>;

  return (
    <main className='p-6 max-w-xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>{goalTitle}</h1>

      <ul className='space-y-4'>
        {tasks.map((task) => (
          <li key={task.id} className='p-4 border rounded space-y-1'>
            <div className='text-sm text-gray-500'>
              {task.profiles?.[0]?.full_name || 'Unknown'} ·{' '}
              {new Date(task.created_at).toLocaleString()}
            </div>
            <div>{task.content}</div>
            <button
              onClick={() => handleReact(task.id, task.reacted_by_me)}
              className='text-blue-600 text-sm'
            >
              ✅ {task.reacted_by_me ? 'Undo' : 'I did this too'} (
              {task.reactions})
            </button>
          </li>
        ))}
      </ul>

      <div className='border-t pt-4 space-y-2'>
        <textarea
          className='w-full border p-2 rounded'
          placeholder='Add your task...'
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className='w-full bg-blue-600 text-white py-2 rounded'
        >
          Add Task
        </button>
      </div>
    </main>
  );
}
