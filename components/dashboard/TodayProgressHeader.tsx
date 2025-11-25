// components/dashboard/TodayProgressHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { DailyTotals } from "@/app/dashboard/page";

// Props received from the server component
type Props = {
  dateISO: string;          // Date in 'YYYY-MM-DD' format
  log: DailyTotals;         // Aggregated nutrition data for the selected day
  caloriesTarget: number;
};

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

// Format ISO date into a human-readable string
function formatDateHuman(dateISO: string): string {
  const date = new Date(dateISO + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Shift a 'YYYY-MM-DD' date by a given number of days, avoiding timezone issues
function shiftDateISO(dateISO: string, deltaDays: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const base = new Date((y ?? 1970), (m ?? 1) - 1, (d ?? 1) + deltaDays);

  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, "0");
  const day = String(base.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function TodayProgressHeader({ dateISO, log, caloriesTarget }: Props) {
  const router = useRouter();

  const caloriesUsed = log.total_calories;
  const caloriesLeft = Math.max(caloriesTarget - caloriesUsed, 0);
  const caloriesPct = clampPercent((caloriesUsed / caloriesTarget) * 100);

  const humanDate = formatDateHuman(dateISO);

  // Navigate to the previous or next day by updating the `date` query parameter
  const goToDay = useCallback(
    (delta: number) => {
      const nextISO = shiftDateISO(dateISO, delta);
      router.push(`/dashboard?date=${nextISO}`);
    },
    [dateISO, router]
  );

  return (
    <section className="rounded-3xl bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400 p-6 text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
            Keep it up!
          </div>
          <h2 className="mt-1 text-lg font-semibold">Today&apos;s Progress</h2>

          {/* Human-readable date for the selected day */}
          <p className="mt-1 text-sm text-slate-900">{humanDate}</p>
        </div>

        {/* Day navigation controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => goToDay(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/70 text-white hover:bg-emerald-200"
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Next day"
            onClick={() => goToDay(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/70 text-white hover:bg-emerald-200"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span>Daily Calories</span>
          <span className="font-medium">
            {caloriesUsed} kcal of {caloriesTarget} kcal
          </span>
        </div>

        {/* Progress bar for daily calories */}
        <div className="mt-3 h-3 w-full rounded-full bg-white">
          <div
            className="h-3 rounded-full bg-violet-300"
            style={{ width: `${caloriesPct}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-black">
          {caloriesLeft > 0
            ? `${caloriesLeft} kcal remaining`
            : "Goal reached for this day"}
        </div>
      </div>
    </section>
  );
}
