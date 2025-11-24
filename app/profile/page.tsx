// app/profile/page.tsx
// app/profile/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { TargetsForm } from "@/components/profile/TargetsForm";

type UserTargetsRow = {
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? null;

  const displayName =
    fullName || user.email?.split("@")[0] || "WellBalance friend";

  const initials = (fullName || user.email || "WB")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("user_targets")
    .select("daily_calories, protein_g, carbs_g, fat_g")
    .eq("user_id", user.id)
    .maybeSingle();

  const targets: UserTargetsRow = data ?? {
    daily_calories: 2000,
    protein_g: 120,
    carbs_g: 200,
    fat_g: 60,
  };

  return (
    <div className="min-h-screen bg-emerald-50/40">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="space-y-6 overflow-x-hidden">
          {/* --------------------------------------------------- */}
          {/* 1. YOUR PROFILE — по размеру как Today’s Progress  */}
          {/* --------------------------------------------------- */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400 p-8 shadow-md min-h-[210px] flex flex-col justify-between">
            {/* верхний маленький лейбл */}
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              YOUR PROFILE
            </p>

            <div className="mt-2 flex items-start justify-between gap-4">
              {/* левая часть — текст */}
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-emerald-950">
                  Welcome back, {displayName}
                </h2>
                <p className="text-[13px] text-emerald-900/80 max-w-md">
                  Manage your daily nutrition goals and personal data. This
                  profile is used to personalize the progress you see on your
                  dashboard.
                </p>
              </div>

              {/* правая часть — аватар и email */}
              <div className="flex flex-col items-end">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/85 text-base font-semibold text-emerald-800 shadow">
                  {initials}
                </div>
                {user.email && (
                  <p className="mt-2 text-[12px] text-emerald-900/80">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --------------------------------------------------- */}
          {/* 2. DAILY NUTRITION GOALS                           */}
          {/* --------------------------------------------------- */}
          <div className="rounded-3xl bg-white/95 p-6 shadow-sm">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-violet-600">
              Daily nutrition goals
            </p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              Targets for your day
            </h2>

            {/* 4 карточки целей */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {/* ---- СИРЕНЕВОЕ поле с текстом ---- */}
              <div className="rounded-2xl bg-violet-300 px-4 py-3 text-xs text-white shadow-sm">
                <p className="text-[11px] opacity-90">Daily Calories Goal</p>
                <p className="text-[11px] opacity-75">
                  Your daily calories target
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {targets.daily_calories} kcal
                </p>
              </div>

              {/* Protein — emerald как на Dashboard */}
              <div className="rounded-2xl bg-emerald-400 px-4 py-3 text-xs text-white shadow-sm">
                <p className="text-[11px] opacity-90">Daily Protein Goal</p>
                <p className="mt-1 text-lg font-semibold">
                  {targets.protein_g} g
                </p>
              </div>

              {/* Fat — rose как на Dashboard */}
              <div className="rounded-2xl bg-rose-400 px-4 py-3 text-xs text-white shadow-sm">
                <p className="text-[11px] opacity-90">Daily Fat Goal</p>
                <p className="mt-1 text-lg font-semibold">
                  {targets.fat_g} g
                </p>
              </div>

              {/* Carbs — amber как на Dashboard */}
              <div className="rounded-2xl bg-amber-400 px-4 py-3 text-xs text-white shadow-sm">
                <p className="text-[11px] opacity-90">Daily Carbs Goal</p>
                <p className="mt-1 text-lg font-semibold">
                  {targets.carbs_g} g
                </p>
              </div>
            </div>

            {/* Форма редактирования */}
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600">
                Edit goals
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Adjust your daily targets. These changes will be reflected on
                the dashboard.
              </p>

              <div className="mt-4">
                <TargetsForm initialTargets={targets} />
              </div>
            </div>
          </div>
{/* KEEP GROWING — обновлённый и стильный */}
<div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-6 shadow-sm border border-emerald-100">

  <div className="flex items-center gap-3 mb-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-200/50 shadow-inner">
      {/* Иконка роста / прогресса */}
      <span className="text-emerald-800 text-xl">🌱</span>
    </div>
    <h2 className="text-base font-semibold text-emerald-900">
      Keep growing!
    </h2>
  </div>

  <p className="text-[13px] text-emerald-900/80 leading-relaxed">
    Your personalized goals support your wellness journey. Keep moving
    forward — small steps lead to big progress.
  </p>

  <ul className="mt-4 space-y-2 text-[13px] text-emerald-800/90">
    <li className="flex gap-2">
      <span className="text-emerald-500 text-lg">•</span>
      <span>Stay consistent with your daily tracking.</span>
    </li>
    <li className="flex gap-2">
      <span className="text-emerald-500 text-lg">•</span>
      <span>Adjust goals as your needs change.</span>
    </li>
    <li className="flex gap-2">
      <span className="text-emerald-500 text-lg">•</span>
      <span>Listen to your body and prioritize balance.</span>
    </li>
  </ul>
</div>

        </section>
      </main>
    </div>
  );
}
