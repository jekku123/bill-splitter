'use client';

import { logout } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function AuthControl() {
  const { data: session } = useSession();
  return (
    <div>
      {!!session && (
        <>
          <p>
            Logged in as {session?.user?.email}, id: {session?.user?.id}
          </p>
          <form action={logout}>
            <button>Logout</button>
          </form>
        </>
      )}
      {!session && (
        <>
          <p>Not logged in</p>
          <Link href="/login">Login</Link> / <Link href="/register">Register</Link>
        </>
      )}
    </div>
  );
}
