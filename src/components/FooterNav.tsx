export default function FooterNav() {
  return (
    <footer className='sticky bottom-0 z-10 bg-zinc-900 text-white border-t border-zinc-800 px-4 py-2 flex justify-around text-sm'>
      <a href='/goals' className='p-2 text-blue-400 font-semibold'>
        🏠 Home
      </a>
      <button className='p-2 text-red-400'>🔓 Logout</button>
    </footer>
  );
}
