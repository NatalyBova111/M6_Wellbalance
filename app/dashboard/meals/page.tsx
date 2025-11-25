// app/dashboard/meals/page.tsx
import { createSupabaseServer } from "@/lib/supabaseServer";
import AddMealClient, { type FoodForClient } from "./AddMealClient";
import type { Database } from "@/database.types";
import type { FoodCategory } from "@/components/ui/food-card";
import AddCustomFoodCard from "./AddCustomFoodCard";

type FoodRow = Database["public"]["Tables"]["foods"]["Row"];

// Map textual macro category from the database to a strongly typed FoodCategory
function mapMacroToCategory(macro: string | null): FoodCategory | null {
  if (!macro) return null;

  switch (macro.toLowerCase()) {
    case "protein":
      return "Protein";
    case "carbs":
      return "Carbs";

    // All fat-related variants are mapped into the single "Fat" category
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
  const supabase = await createSupabaseServer();

  // Fetch public foods with macro categories and nutrition information
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

  // Render a simple error state if loading fails
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

  // Filter out rows that do not have complete macronutrient information
  const rows: FoodRow[] = (data ?? []).filter(
    (f): f is FoodRow =>
      f.calories_per_serving !== null &&
      f.protein_per_serving !== null &&
      f.carbs_per_serving !== null &&
      f.fat_per_serving !== null
  );

  // Adapt database rows to a client-friendly shape
  const foodsForClient: FoodForClient[] = rows.map((f) => ({
    id: f.id,
    name: f.name ?? "",
    // Safely map macro_category into a typed FoodCategory value
    category: mapMacroToCategory(f.macro_category),
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
        {/* Page header */}
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Add Meal</h1>
          <p className="text-sm text-slate-500">
            Choose foods to add to the daily log.
          </p>
        </header>

        {/* Main meal selection UI */}
        <AddMealClient foods={foodsForClient} />

        {/* Card for adding a custom food item into the catalog */}
        <AddCustomFoodCard />
      </div>
    </main>
  );
}
