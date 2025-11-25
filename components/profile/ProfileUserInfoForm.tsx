// ProfileUserInfoForm.tsx
"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type ProfileUserInfoFormProps = {
  initialFullName: string | null;
  email: string | null;
};

export function ProfileUserInfoForm({
  initialFullName,
  email,
}: ProfileUserInfoFormProps) {
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle submission of updated profile information
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { error: updateError } = await supabaseBrowser.auth.updateUser({
        data: {
          full_name: fullName || null,
        },
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setMessage("Profile updated.");
    } catch (err: unknown) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {/* Full name and email fields */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Full name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">
            Full name
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              👤
            </span>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white px-8 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Read-only email display */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">
            Email address
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ✉️
            </span>
            <input
              type="email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-8 py-2 text-sm text-slate-500 shadow-sm"
              value={email ?? ""}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Submit button and status messages */}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>

      {message && (
        <p className="mt-1 text-xs text-emerald-600">{message}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </form>
  );
}
