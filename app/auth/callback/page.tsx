// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
      // After successful authentication, redirect the user to the dashboard.
    // This acts as a placeholder callback handler for auth providers.
    router.replace('/dashboard');
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Finishing sign in…</h1>
      <p>Redirecting to dashboard…</p>
    </main>
  );
}
