"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type FoodCategory =
  | "Protein"
  | "Carbs"
  | "Fat"
  | "Vegetables"
  | "Fruits";


export type FoodCardProps = {
  id: string;
  name: string;
  category: FoodCategory;
  servingAmount: number;
  servingUnit: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  onAdd?: (id: string) => void;
};

export function FoodCard({
  id,
  name,
  category,
  servingAmount,
  servingUnit,
  calories,
  proteinGrams,
  carbsGrams,
  fatGrams,
  onAdd,
}: FoodCardProps) {
  const categoryColorClass: Record<FoodCategory, string> = {
    Protein: "bg-emerald-100 text-emerald-700",
    Carbs: "bg-amber-100 text-amber-700",
    Fat: "bg-rose-100 text-rose-700",
    Vegetables: "bg-green-100 text-green-700",
    Fruits: "bg-violet-100 text-violet-700",
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-50 bg-white/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div
            className={cn(
              "mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
              categoryColorClass[category]
            )}
          >
            {category}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onAdd?.(id)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
          aria-label={`Add ${name}`}
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Serving
          </div>
          <div className="mt-1 font-medium text-slate-900">
            {servingAmount} {servingUnit}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">
            Calories
          </div>
          <div className="mt-1 font-semibold text-emerald-600">
            {calories} kcal
          </div>
        </div>
      </div>

      <div className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
        <div className="rounded-xl bg-emerald-50 px-2 py-1 text-center">
          <div className="text-slate-400">Protein</div>
          <div className="mt-0.5 font-semibold text-slate-900">
            {proteinGrams} g
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 px-2 py-1 text-center">
          <div className="text-slate-400">Carbs</div>
          <div className="mt-0.5 font-semibold text-slate-900">
            {carbsGrams} g
          </div>
        </div>
        <div className="rounded-xl bg-rose-50 px-2 py-1 text-center">
          <div className="text-slate-400">Fat</div>
          <div className="mt-0.5 font-semibold text-slate-900">
            {fatGrams} g
          </div>
        </div>
      </div>
    </div>
  );
}
