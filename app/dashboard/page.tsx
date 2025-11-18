// app/dashboard/page.tsx
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabaseServer";
import type { Database } from "@/database.types";

type DailyLogRow = Database["public"]["Tables"]["daily_logs"]["Row"];

// ⚠️ ВРЕМЕННО: жёстко заданный user_id (тот же, что в /api/add-meal-item)
// TODO: позже заменить на реального пользователя из auth
const HARDCODED_USER_ID = "9ad6dc57-9d88-4867-a94b-6895b697d23c";

// цели на день (можно потом вынести в настройки профиля)
const CALORIES_TARGET = 2000;
const PROTEIN_TARGET = 120;
const CARBS_TARGET = 200;
const FAT_TARGET = 60;

function getTodayDateISO(): string {
  // тот же формат, что мы сохраняем в daily_logs: 'YYYY-MM-DD'
  return new Date().toISOString().slice(0, 10);
}

function formatDateHuman(dateISO: string): string {
  const date = new Date(dateISO);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function clampPercent(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

// Наш собственный тип с гарантированными number,
// чтобы TS не думал, что там может быть null
type DailyTotals = {
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const todayISO = getTodayDateISO();

  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", HARDCODED_USER_ID)
    .eq("log_date", todayISO)
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

  const caloriesUsed = log.total_calories;
  const caloriesLeft = Math.max(CALORIES_TARGET - caloriesUsed, 0);
  const caloriesPct = clampPercent(
    (caloriesUsed / CALORIES_TARGET) * 100
  );

  const proteinPct = clampPercent(
    (log.protein_g / PROTEIN_TARGET) * 100
  );
  const carbsPct = clampPercent((log.carbs_g / CARBS_TARGET) * 100);
  const fatPct = clampPercent((log.fat_g / FAT_TARGET) * 100);

  // --- доли для круговой диаграммы макросов ---
  const totalMacros = log.protein_g + log.carbs_g + log.fat_g;
  const safeTotal = totalMacros > 0 ? totalMacros : 1;

  const proteinShare = clampPercent((log.protein_g / safeTotal) * 100);
  const carbsShare = clampPercent((log.carbs_g / safeTotal) * 100);
  const fatShare = clampPercent((log.fat_g / safeTotal) * 100);

  const todayHuman = formatDateHuman(todayISO);

  return (
    <div className="min-h-screen bg-emerald-50/40">
      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Заголовок страницы */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              WellBalance • Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your daily calories and macronutrients.
            </p>
          </div>

          <Link
            href="/dashboard/meals"
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
          >
            Add Meal
          </Link>
        </header>

        <div className="space-y-8">
          {/* Блок “Today’s progress” + Daily Calories */}
          <section className="grid gap-6 lg:grid-cols-[2fr,1.4fr]">
            {/* Левая зелёная карточка — Today’s Progress */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-400 to-emerald-500 p-6 text-white shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-100">
                    Keep it up!
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">
                    Today&apos;s Progress
                  </h2>
                  <p className="mt-1 text-sm text-emerald-100">
                    {todayHuman}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span>Daily Calories</span>
                  <span className="font-medium">
                    {caloriesUsed} kcal of {CALORIES_TARGET} kcal
                  </span>
                </div>

                <div className="mt-3 h-3 w-full rounded-full bg-emerald-300/40">
                  <div
                    className="h-3 rounded-full bg-white shadow-sm"
                    style={{ width: `${caloriesPct}%` }}
                  />
                </div>

                <div className="mt-2 text-xs text-emerald-100">
                  {caloriesLeft > 0
                    ? `${caloriesLeft} kcal remaining`
                    : "Goal reached for today"}
                </div>
              </div>
            </div>

            {/* Правая карточка — цифры по калориям + кратко макросы */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h3 className="text-sm font-semibold text-slate-900">
                Today&apos;s summary
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="text-xs text-emerald-700">
                    Total calories
                  </div>
                  <div className="mt-1 text-xl font-semibold text-emerald-800">
                    {caloriesUsed} kcal
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-700/80">
                    Target: {CALORIES_TARGET} kcal
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-600">
                    Remaining today
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    {caloriesLeft} kcal
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Based on your daily goal
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                Meals you add on the{" "}
                <span className="font-medium text-emerald-600">
                  Add Meal
                </span>{" "}
                page are summed here for the current day.
              </div>
            </div>
          </section>

          {/* Блок “Macronutrients Balance” */}
          <section className="rounded-3xl bg-white p-6 shadow-md">
            <h2 className="text-sm font-semibold text-slate-900">
              Macronutrients Balance
            </h2>
              <p className="mt-1 text-xs text-slate-500">
    Circle shows today’s macro distribution. Bars show progress toward your daily goals.
  </p>


            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              {/* Круговая диаграмма “Total macros” */}
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <svg viewBox="0 0 36 36" className="h-full w-full">
                    {/* фон круга */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#e5e7eb" // slate-200
                      strokeWidth="4"
                    />

                    {/* Protein (зелёный) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#10b981" // emerald-500
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${proteinShare} ${
                        100 - proteinShare
                      }`}
                      strokeDashoffset={0}
                      transform="rotate(-90 18 18)"
                    />

                    {/* Carbs (жёлтый) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#f59e0b" // amber-500
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${carbsShare} ${
                        100 - carbsShare
                      }`}
                      strokeDashoffset={-proteinShare}
                      transform="rotate(-90 18 18)"
                    />

                    {/* Fat (розовый) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#fb7185" // rose-400-ish
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${fatShare} ${100 - fatShare}`}
                      strokeDashoffset={-(proteinShare + carbsShare)}
                      transform="rotate(-90 18 18)"
                    />
                  </svg>

                  {/* подписи в центре круга */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-xs text-slate-500">Total</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {totalMacros} g
                    </div>
                  </div>
                </div>
              </div>

              {/* Полоски по каждому макроэлементу */}
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
                    <span className="font-medium text-amber-600">
                      Carbs
                    </span>
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

          {/* Место под будущее: настроение, вода и т.д. */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-slate-900">
                How are you feeling?
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                For now this is just a placeholder. Later we can add a
                mood tracker or quick check-in buttons like in the
                prototype.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-slate-900">
                Water Intake
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                We can connect this block to your{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[10px]">
                  water_intake
                </code>{" "}
                table later, similar to calories and macros.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
