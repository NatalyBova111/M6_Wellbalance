'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { supabaseBrowser } from '@/lib/supabaseBrowser';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export default function LoginPage() {
  const router = useRouter();

  // Local state for login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state for loading and errors
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handles user login via Supabase email/password auth
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await supabaseBrowser.auth.signInWithPassword({
        email,
        password,
      });

      // Display authentication error if provided by Supabase
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      // Successful login routes to the dashboard
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50/40 to-teal-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-emerald-100 grid md:grid-cols-2 overflow-hidden">
        {/* Left section: shown only on medium screens and above */}
        <div className="bg-linear-to-br from-emerald-100 via-emerald-50 to-white p-8 md:p-10 hidden md:flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 shadow-xs mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Wellness Tracker
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-emerald-900 mb-3">
              Welcome back
            </h1>

            <p className="text-sm text-emerald-800/80">
              Continue your wellness journey and monitor your daily habits.
            </p>
          </div>

          <p className="mt-8 text-xs text-emerald-700/80">
            Tip: passwords can be reset using the link in the login form.
          </p>
        </div>

        {/* Right section — login form */}
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-emerald-500 font-semibold">
                Log in
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                Sign in to WellBalance
              </h2>
            </div>

            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
              <Button
                variant="ghost"
                className="h-7 px-3 text-xs rounded-full text-slate-500"
                type="button"
                onClick={() => router.push('/signup')}
              >
                Sign up
              </Button>
              <Button
                variant="outline"
                className="h-7 px-3 text-xs rounded-full border-0 bg-white shadow-sm"
              >
                Log in
              </Button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>

            {/* Error message */}
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? 'Signing in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-emerald-600 underline-offset-2 hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
