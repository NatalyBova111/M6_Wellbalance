// app/dashboard/meals/page.tsx
import { createSupabaseServer } from "@/lib/supabaseServer";
import AddMealClient, { type FoodForClient } from "./AddMealClient";
import type { Database } from "@/database.types";
import type { FoodCategory } from "@/components/ui/food-card";


type FoodRow = Database["public"]["Tables"]["foods"]["Row"];

// маппим текст из БД → типизированную категорию

function mapMacroToCategory(macro: string | null): FoodCategory | null {
  if (!macro) return null;

  switch (macro.toLowerCase()) {
    case "protein":
      return "Protein";
    case "carbs":
      return "Carbs";

    // все варианты жирной категории мапим в одну категорию Fat
    case "fat":
    case "fats":
    case "healthy fats":
      return "Fat";

    case "vegetables":
      return "Vegetables";

    case "fruits":
    case "fruit":
      return "Fruits";

    default:
      return null;
  }
}


export default async function MealsPage() {
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("foods")
    .select(
      `
      id,
      name,
      macro_category,
      serving_qty,
      serving_unit,
      calories_per_serving,
      protein_per_serving,
      carbs_per_serving,
      fat_per_serving
    `
    )
    .eq("is_public", true)
    .order("name");

  if (error) {
    console.error("Failed to load foods:", error);
    return (
      <main className="min-h-screen bg-emerald-50/40">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm text-red-600">Failed to load foods.</p>
        </div>
      </main>
    );
  }

  const rows: FoodRow[] = (data ?? []).filter(
    (f): f is FoodRow =>
      f.calories_per_serving !== null &&
      f.protein_per_serving !== null &&
      f.carbs_per_serving !== null &&
      f.fat_per_serving !== null
  );

  const foodsForClient: FoodForClient[] = rows.map((f) => ({
    id: f.id,
    name: f.name ?? "",
    category: mapMacroToCategory(f.macro_category), // <-- без any
    servingQty: Number(f.serving_qty ?? 100),
    servingUnit: f.serving_unit ?? "g",
    caloriesPerServing: f.calories_per_serving ?? 0,
    proteinPerServing: Number(f.protein_per_serving ?? 0),
    carbsPerServing: Number(f.carbs_per_serving ?? 0),
    fatPerServing: Number(f.fat_per_serving ?? 0),
  }));

  return (
    <main className="min-h-screen bg-emerald-50/40">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Add Meal</h1>
          <p className="text-sm text-slate-500">
            Choose foods to add to your daily log.
          </p>
        </header>

        <AddMealClient foods={foodsForClient} />
      </div>
    </main>
  );
}
