'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex gap-4 items-center">
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-black dark:text-zinc-50">{user.name}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>
      <LogoutButton />
    </div>
  );
}

