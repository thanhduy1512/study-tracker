import Link from 'next/link';

export default function Header() {
  return (
    <header className='sticky top-0 z-10 bg-zinc-900 text-white border-b border-zinc-800 px-4 py-3 flex justify-between items-center'>
      <Link href='/goals' className='text-lg font-semibold hover:underline'>
        📚 Milestone
      </Link>
      <div className='text-sm text-zinc-400 truncate'>Hi, User</div>
    </header>
  );
}
