// app/api/foods/custom/route.ts
import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabaseServer';

type MacroCategory =
  | 'protein'
  | 'carbs'
  | 'fat'
  | 'vegetables'
  | 'fruits';

export async function POST(req: Request) {
  const supabase = await createSupabaseServer();

  // если хочешь, можно использовать user.id как owner_id
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = await req.json();

  const {
    name,
    macroCategory,
    servingQty,
    servingUnit,
    caloriesPerServing,
    proteinPerServing,
    carbsPerServing,
    fatPerServing,
  } = body as {
    name: string;
    macroCategory: MacroCategory;
    servingQty?: number;
    servingUnit?: string;
    caloriesPerServing?: number;
    proteinPerServing?: number;
    carbsPerServing?: number;
    fatPerServing?: number;
  };

  if (!name || !macroCategory) {
    return NextResponse.json(
      { error: 'Name and category are required.' },
      { status: 400 },
    );
  }

  const insertPayload = {
    owner_id: user?.id ?? null, // можно потом фильтровать по owner_id, если понадобится
    name,
    brand: null,
    serving_unit: servingUnit ?? 'g',
    serving_qty: servingQty ?? 100,
    calories_per_serving: caloriesPerServing ?? null,
    protein_per_serving: proteinPerServing ?? null,
    carbs_per_serving: carbsPerServing ?? null,
    fat_per_serving: fatPerServing ?? null,
    is_public: true,
    macro_category: macroCategory, // ← ВАЖНО: именно сюда идёт protein / carbs / fat / vegetables / fruits
  };

  const { data, error } = await supabase
    .from('foods')
    .insert(insertPayload)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Failed to insert custom food:', error);
    return NextResponse.json(
      { error: 'Failed to save product.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ food: data }, { status: 201 });
}
