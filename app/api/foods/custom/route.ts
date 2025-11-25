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

  // Retrieve the currently authenticated user (if any)
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

  // Basic validation: name and category are mandatory
  if (!name || !macroCategory) {
    return NextResponse.json(
      { error: 'Name and category are required.' },
      { status: 400 },
    );
  }

  // Payload to insert into the "foods" table
  const insertPayload = {
    // Owner is linked to the authenticated user if available
    owner_id: user?.id ?? null,
    name,
    brand: null,
    serving_unit: servingUnit ?? 'g',
    serving_qty: servingQty ?? 100,
    calories_per_serving: caloriesPerServing ?? null,
    protein_per_serving: proteinPerServing ?? null,
    carbs_per_serving: carbsPerServing ?? null,
    fat_per_serving: fatPerServing ?? null,
    is_public: true,
    // Macro category stored as one of: protein / carbs / fat / vegetables / fruits
    macro_category: macroCategory,
  };

  const { data, error } = await supabase
    .from('foods')
    .insert(insertPayload)
    .select()
    .maybeSingle();

  // Handle insertion failure
  if (error) {
    console.error('Failed to insert custom food:', error);
    return NextResponse.json(
      { error: 'Failed to save product.' },
      { status: 500 },
    );
  }

  // Return the created food item
  return NextResponse.json({ food: data }, { status: 201 });
}
