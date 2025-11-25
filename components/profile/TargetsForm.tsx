"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type Targets = {
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type Props = {
  initialTargets: Targets;
};

export function TargetsForm({ initialTargets }: Props) {
  const [values, setValues] = useState<Targets>(initialTargets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update individual numeric fields while sanitizing invalid values
  function updateField<K extends keyof Targets>(key: K, value: string) {
    const num = Number(value);
    setValues((prev) => ({
      ...prev,
      [key]: Number.isNaN(num) ? 0 : num,
    }));
  }

  // Submit updated target values to Supabase
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      // Retrieve the current authenticated user on the client
      const {
        data: { user },
        error: userError,
      } = await supabaseBrowser.auth.getUser();

      if (userError || !user) {
        setError("You need to be logged in to save targets.");
        return;
      }

      // Temporary type override because user_targets
      // is not yet included in database.types.ts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const client: any = supabaseBrowser;

      const { error: upsertError } = await client
        .from("user_targets")
        .upsert(
          {
            user_id: user.id,
            daily_calories: values.daily_calories,
            protein_g: values.protein_g,
            carbs_g: values.carbs_g,
            fat_g: values.fat_g,
          },
          { onConflict: "user_id" }
        );

      if (upsertError) {
        console.error("Failed to save user_targets:", upsertError);
        setError(upsertError.message);
        return;
      }

      setMessage("Targets saved successfully.");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message ?? "Unexpected error");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {/* Four input fields for daily nutrition targets */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily calories */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Daily calories (kcal)
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={values.daily_calories}
            onChange={(e) => updateField("daily_calories", e.target.value)}
          />
        </div>

        {/* Protein */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Protein per day (g)
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={values.protein_g}
            onChange={(e) => updateField("protein_g", e.target.value)}
          />
        </div>

        {/* Carbs */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Carbs per day (g)
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={values.carbs_g}
            onChange={(e) => updateField("carbs_g", e.target.value)}
          />
        </div>

        {/* Fat */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">
            Fat per day (g)
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={values.fat_g}
            onChange={(e) => updateField("fat_g", e.target.value)}
          />
        </div>
      </div>

      {/* Save button */}
      <button
        type="submit"
        disabled={saving}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save targets"}
      </button>

      {/* Status messages */}
      {message && (
        <p className="text-xs text-emerald-600 mt-2">{message}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </form>
  );
}
