// app/api/add-meal-item/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabaseServer";

type AddMealBody = {
  foodId: string;
  grams: number;
  caloriesTotal: number;
  proteinTotal: number;
  carbsTotal: number;
  fatTotal: number;
};

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();

  // 🔐 Get the current authenticated user from the session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = user.id;

  // Parse request body
  const body = (await req.json()) as AddMealBody;
  const {
    foodId,
    grams,
    caloriesTotal,
    proteinTotal,
    carbsTotal,
    fatTotal,
  } = body;

  // Determine today's date in YYYY-MM-DD format
  const today = new Date().toISOString().slice(0, 10);

  // 1) Read existing daily log for this user for today (if it exists)
  const { data: existing, error: selectError } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", today)
    .maybeSingle();

  // If there is an unexpected error, return 500
  if (selectError && selectError.code !== "PGRST116") {
    console.error("Failed to fetch daily_log:", selectError);
    return NextResponse.json(
      { error: "Failed to fetch daily log", details: selectError },
      { status: 500 }
    );
  }

  // 2) Convert totals to integers (Postgres int4)
  const addCalories = Math.round(caloriesTotal);
  const addProtein = Math.round(proteinTotal);
  const addCarbs = Math.round(carbsTotal);
  const addFat = Math.round(fatTotal);

  // 3) Calculate updated totals for today (existing + new values)
  const newTotals = {
    total_calories: (existing?.total_calories ?? 0) + addCalories,
    protein_g: (existing?.protein_g ?? 0) + addProtein,
    carbs_g: (existing?.carbs_g ?? 0) + addCarbs,
    fat_g: (existing?.fat_g ?? 0) + addFat,
  };

  // 4) Upsert row into daily_logs for the pair (user_id, log_date)
  // If the row exists → update. If not → create a new row.
  const { data: logs, error: logError } = await supabase
    .from("daily_logs")
    .upsert(
      {
        user_id: userId,
        log_date: today,
        ...newTotals,
      },
      {
        onConflict: "user_id,log_date",
        ignoreDuplicates: false,
      }
    )
    .select("*");

  // Handle failure
  if (logError || !logs || !logs[0]) {
    console.error("Failed to update daily_logs:", logError);
    return NextResponse.json(
      { error: "Failed to update daily_logs", details: logError },
      { status: 500 }
    );
  }

  const dailyLog = logs[0];

  // Log operation for debugging
  console.log("Meal item added:", {
    userId,
    foodId,
    grams,
    added: { addCalories, addProtein, addCarbs, addFat },
    dailyLogId: dailyLog.id,
  });

  // Return updated daily log
  return NextResponse.json({ ok: true, dailyLog });
}
