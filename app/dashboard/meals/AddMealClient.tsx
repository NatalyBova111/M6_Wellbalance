"use client";

import { useMemo, useState } from "react";
import { FoodCard, type FoodCategory } from "@/components/ui/food-card";

export type FoodForClient = {
  id: string;
  name: string;
  // категория может быть null, если в БД нет macro_category
  category: FoodCategory | null;
  servingQty: number;
  servingUnit: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
};

type Props = {
  foods: FoodForClient[];
};

// строго: ключи — это именно FoodCategory
type GroupedFoods = Record<FoodCategory, FoodForClient[]>;

function createEmptyGroups(): GroupedFoods {
  return {
    Protein: [],
    Carbs: [],
    Fat: [],
    Vegetables: [],
    Fruits: [],
  };
}

function groupByCategory(foods: FoodForClient[]): GroupedFoods {
  const groups = createEmptyGroups();

  for (const food of foods) {
    if (!food.category) continue; // без категории не показываем
    groups[food.category].push(food);
  }

  return groups;
}

export default function AddMealClient({ foods }: Props) {
  const [query, setQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodForClient | null>(null);
  const [grams, setGrams] = useState<string>("100");

  const filteredFoods = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((f) => f.name.toLowerCase().includes(q));
  }, [foods, query]);

  const grouped = useMemo(
    () => groupByCategory(filteredFoods),
    [filteredFoods]
  );

  const gramsNumber = Number(grams) || 0;
  const factor =
    selectedFood && selectedFood.servingQty > 0
      ? gramsNumber / selectedFood.servingQty
      : 0;

  const caloriesTotal = selectedFood
    ? Math.round(selectedFood.caloriesPerServing * factor)
    : 0;
  const proteinTotal = selectedFood
    ? +(selectedFood.proteinPerServing * factor).toFixed(1)
    : 0;
  const carbsTotal = selectedFood
    ? +(selectedFood.carbsPerServing * factor).toFixed(1)
    : 0;
  const fatTotal = selectedFood
    ? +(selectedFood.fatPerServing * factor).toFixed(1)
    : 0;

  return (
    <>
      {/* Поиск */}
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search for foods..."
          className="w-full rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Группы категорий с карточками */}
      <div className="space-y-8">
        {(Object.keys(grouped) as FoodCategory[]).map((category) => {
          const items = grouped[category];
          if (!items.length) return null;

          return (
            <section key={category}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((food) => (
                  <FoodCard
                    key={food.id}
                    id={food.id}
                    name={food.name}
                    category={category}
                    servingAmount={food.servingQty}
                    servingUnit={food.servingUnit}
                    calories={food.caloriesPerServing}
                    proteinGrams={food.proteinPerServing}
                    carbsGrams={food.carbsPerServing}
                    fatGrams={food.fatPerServing}
                    onAdd={() => {
                      setSelectedFood(food);
                      setGrams(String(food.servingQty || 100));
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* МОДАЛЬНОЕ ОКНО добавления */}
      {selectedFood && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                  Add to today
                </div>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedFood.name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Base: {selectedFood.servingQty}
                  {selectedFood.servingUnit} ·{" "}
                  {selectedFood.caloriesPerServing} kcal
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Поле ввода количества */}
            <div className="mb-4 flex items-center gap-3">
              <div className="text-xs text-slate-500">
                Amount ({selectedFood.servingUnit}):
              </div>
              <input
                type="number"
                min={0}
                className="w-28 rounded-lg border border-emerald-200 px-2 py-1 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
              />
            </div>

            {/* Итоги по калориям и макросам */}
            <div className="mb-4 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-emerald-50 p-3">
                <div className="text-[11px] uppercase tracking-wide text-emerald-600">
                  Calories
                </div>
                <div className="mt-1 text-xl font-semibold text-emerald-700">
                  {caloriesTotal} kcal
                </div>
                <div className="mt-1 text-[11px] text-emerald-700/70">
                  for this amount
                </div>
              </div>

              <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Protein</span>
                  <span className="text-[11px] font-semibold text-slate-900">
                    {proteinTotal} g
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Carbs</span>
                  <span className="text-[11px] font-semibold text-slate-900">
                    {carbsTotal} g
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Fat</span>
                  <span className="text-[11px] font-semibold text-slate-900">
                    {fatTotal} g
                  </span>
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedFood(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/add-meal-item", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        foodId: selectedFood.id,
                        grams: gramsNumber,
                        caloriesTotal,
                        proteinTotal,
                        carbsTotal,
                        fatTotal,
                      }),
                    });

                    if (!res.ok) {
                      const text = await res.text();
                      console.error("Failed to add meal item:", text);
                      return;
                    }

                    const data = await res.json();
                    console.log("Saved to daily log:", data);
                    setSelectedFood(null);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                Add to today
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
