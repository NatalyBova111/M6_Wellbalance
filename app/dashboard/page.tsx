// app/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import type { Database } from "@/database.types";
import TodayProgressHeader from "@/components/dashboard/TodayProgressHeader";

export const dynamic = "force-dynamic";

type DailyLogRow = Database["public"]["Tables"]["daily_logs"]["Row"];

export type DailyTotals = {
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

// -----------------------------
// Helper functions
// -----------------------------

type SearchParamsShape = { date?: string };

function getTodayDateISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeDate(searchParams?: SearchParamsShape): string {
  const today = getTodayDateISO();
  const fromQuery = searchParams?.date;

  if (!fromQuery) return today;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromQuery)) return today;

  return fromQuery;
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

// -----------------------------
// Main Dashboard page
// Next 16 → searchParams: Promise
// -----------------------------

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsShape>;
}) {
  const supabase = await createSupabaseServer();

  // Check authentication state
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userId = user.id;

  // Await searchParams in the Next 16 route handler
  const resolved = await searchParams;
  const selectedDateISO = normalizeDate(resolved);

  // 1) Load daily log for the selected date
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", selectedDateISO)
    .maybeSingle<DailyLogRow>();

  if (error) {
    console.error("Failed to load daily_logs:", error);
  }

  const log: DailyTotals = {
    total_calories: Number(data?.total_calories ?? 0),
    protein_g: Number(data?.protein_g ?? 0),
    carbs_g: Number(data?.carbs_g ?? 0),
    fat_g: Number(data?.fat_g ?? 0),
  };

  // 2) Load user-specific nutrition targets
  // The user_targets table is not yet described in database.types.ts,
  // so Supabase is temporarily cast to any for this query only.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: targetsRow, error: targetsError } = await (supabase as any)
    .from("user_targets")
    .select("daily_calories, protein_g, carbs_g, fat_g")
    .eq("user_id", userId)
    .maybeSingle();

  if (targetsError) {
    console.error("Failed to load user_targets:", targetsError);
  }

  const CALORIES_TARGET = targetsRow?.daily_calories ?? 2000;
  const PROTEIN_TARGET = targetsRow?.protein_g ?? 120;
  const CARBS_TARGET = targetsRow?.carbs_g ?? 200;
  const FAT_TARGET = targetsRow?.fat_g ?? 60;

  // 3) Progress calculations
  const caloriesUsed = log.total_calories;
  const caloriesLeft = Math.max(CALORIES_TARGET - caloriesUsed, 0);

  const proteinPct = clampPercent(
    PROTEIN_TARGET > 0 ? (log.protein_g / PROTEIN_TARGET) * 100 : 0
  );
  const carbsPct = clampPercent(
    CARBS_TARGET > 0 ? (log.carbs_g / CARBS_TARGET) * 100 : 0
  );
  const fatPct = clampPercent(
    FAT_TARGET > 0 ? (log.fat_g / FAT_TARGET) * 100 : 0
  );

  return (
    <div className="min-h-screen bg-emerald-50/40">
      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Today Progress based on user-specific calorie target */}
        <TodayProgressHeader
          dateISO={selectedDateISO}
          log={log}
          caloriesTarget={CALORIES_TARGET}
        />

        {/* Add Meal button */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/dashboard/meals"
            className="px-5 py-2.5 rounded-full bg-violet-200 text-violet-800 font-medium shadow-sm hover:bg-violet-300 transition-colors duration-200"
          >
            + Add Meal
          </Link>
        </div>

        {/* Main content */}
        <div className="mt-8 space-y-8">
          <section className="grid gap-6 lg:grid-cols-[2fr,1.4fr]">
            {/* Total calories */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h3 className="text-sm font-semibold text-slate-900">
                Total calories
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="text-xs text-emerald-700">Total calories</div>
                  <div className="mt-1 text-xl font-semibold text-emerald-800">
                    {caloriesUsed} kcal
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-700/80">
                    Target: {CALORIES_TARGET} kcal
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-600">Remaining today</div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    {caloriesLeft} kcal
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Based on your daily goal
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                Meals added on the{" "}
                <Link
                  href="/dashboard/meals"
                  className="font-medium text-emerald-600 underline-offset-2 hover:underline"
                >
                  Add Meal
                </Link>{" "}
                page are summed here for the selected day.
              </div>
            </div>

            {/* Macronutrients */}
            <section className="rounded-3xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-slate-900">
                Macronutrients Balance
              </h2>

              <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {/* Ring overview */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
                    <div className="h-28 w-28 rounded-full border-[10px] border-emerald-400/70 border-t-amber-400/80 border-r-rose-400/80" />
                    <div className="absolute text-center">
                      <div className="text-xs text-slate-500">Total</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {log.protein_g + log.carbs_g + log.fat_g} g
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 max-w-xs text-center text-[11px] text-slate-500">
                    The ring shows the total amount of protein, carbs and fat
                    eaten on this day.
                  </p>
                </div>

                {/* Progress bars for each macronutrient */}
                <div className="space-y-4">
                  {/* Protein */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-emerald-700">
                        Protein
                      </span>
                      <span className="text-slate-500">
                        {log.protein_g}g / {PROTEIN_TARGET}g
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-emerald-50">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${proteinPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-amber-600">Carbs</span>
                      <span className="text-slate-500">
                        {log.carbs_g}g / {CARBS_TARGET}g
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-amber-50">
                      <div
                        className="h-2 rounded-full bg-amber-400"
                        style={{ width: `${carbsPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Fat */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-rose-600">Fat</span>
                      <span className="text-slate-500">
                        {log.fat_g}g / {FAT_TARGET}g
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-50">
                      <div
                        className="h-2 rounded-full bg-rose-400"
                        style={{ width: `${fatPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>

          {/* Placeholder sections for future features */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-slate-900">
                How are you feeling?
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Future mood tracker placeholder.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-slate-900">
                Water Intake
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                Future hydration tracker placeholder.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
