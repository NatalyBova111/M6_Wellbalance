'use client';

import { FormEvent, useState } from 'react';

type MacroCategory = 'protein' | 'carbs' | 'fat' | 'vegetables' | 'fruits';

export default function AddCustomFoodCard() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MacroCategory>('protein');
  const [servingQty, setServingQty] = useState('100');
  const [servingUnit, setServingUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/foods/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          macroCategory: category,
          servingQty: servingQty ? Number(servingQty) : undefined,
          servingUnit: servingUnit || 'g',
          caloriesPerServing: calories ? Number(calories) : undefined,
          proteinPerServing: protein ? Number(protein) : undefined,
          carbsPerServing: carbs ? Number(carbs) : undefined,
          fatPerServing: fat ? Number(fat) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage(data.error ?? 'Failed to save product.');
      } else {
        setStatusMessage('Product saved ✅');

        // очистить форму
        setName('');
        setCategory('protein');
        setServingQty('100');
        setServingUnit('g');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');

        // чтобы новый продукт появился в списке — просто перезагрузим страницу
        // (можно заменить на мягкий refresh через router.refresh(), если захочешь)
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { key: MacroCategory; label: string; icon: string }[] = [
    { key: 'protein', label: 'Protein', icon: '💪' },
    { key: 'carbs', label: 'Carbs', icon: '🍞' },
    { key: 'fat', label: 'Fat', icon: '🥑' },
    { key: 'vegetables', label: 'Vegetables', icon: '🥦' },
    { key: 'fruits', label: 'Fruits', icon: '🍎' },
  ];

  return (
    <section className="rounded-3xl bg-white p-6 shadow-md mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          🥗
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Add your own product
          </h2>
          <p className="text-[11px] text-slate-500">
            Save a custom food to one of your macro categories.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Название */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Product name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
            placeholder="e.g. Cottage cheese 5%"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Категория */}
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center justify-center gap-1 rounded-full border px-3 py-1.5 text-xs transition ${
                  category === cat.key
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Порция */}
        <div className="grid gap-3 sm:grid-cols-[2fr,1fr]">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Serving size
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              value={servingQty}
              onChange={(e) => setServingQty(e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Unit
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              placeholder="g"
            />
          </div>
        </div>

        {/* Макросы */}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Calories
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="kcal"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Protein (g)
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="g"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Carbs (g)
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="g"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-700">
              Fat (g)
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-xl border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="g"
            />
          </div>
        </div>

        {/* Статус + кнопка */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px]">
            {statusMessage && (
              <span
                className={
                  statusMessage.includes('✅')
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }
              >
                {statusMessage}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </form>
    </section>
  );
}
