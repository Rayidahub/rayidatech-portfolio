// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl text-gray-400 mb-6">Project Not Found</h2>
      <p className="text-gray-500 mb-8">
        The project youre looking for doesnt exist or has been moved.
      </p>
      <Link
        href="/projects"
        className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-all"
      >
        View All Projects
      </Link>
    </main>
  );
}