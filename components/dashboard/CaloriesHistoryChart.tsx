// components/dashboard/CaloriesHistoryChart.tsx

"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
} from "recharts";

export type CalorieHistoryPoint = {
  dateISO: string;
  label: string;
  calories: number;
};

type CaloriesHistoryChartProps = {
  data: CalorieHistoryPoint[];
  caloriesTarget: number;
  selectedDateISO: string;
};

export default function CaloriesHistoryChart({
  data,
  caloriesTarget,
  selectedDateISO,
}: CaloriesHistoryChartProps) {
  const maxCalories = Math.max(caloriesTarget, ...data.map((d) => d.calories));
  const yMax = Math.max(maxCalories, 100);
  const selectedIndex = data.findIndex((d) => d.dateISO === selectedDateISO);

  const total = data.reduce((sum, d) => sum + d.calories, 0);
  const average = data.length > 0 ? total / data.length : 0;
  const highest = data.reduce((max, d) => Math.max(max, d.calories), 0);
  const lowest =
    data.length > 0 ? data.reduce((min, d) => Math.min(min, d.calories), data[0].calories) : 0;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
          <span className="text-lg">📊</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Weekly Calorie Trend
          </h2>
          <p className="text-xs text-slate-500">
            Last 7 days overview (target {caloriesTarget} kcal)
          </p>
        </div>
      </div>

      <div className="mt-6 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              domain={[0, yMax * 1.1]}
              tickFormatter={(v: number) => `${Math.round(v)}`}
            />

            {/* Target calories dashed line */}
            <ReferenceLine
              y={caloriesTarget}
              stroke="#22c55e"
              strokeDasharray="4 4"
              strokeWidth={1}
            />

            {/* Tooltip (unchanged, as requested) */}
            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.15)" }}
              formatter={(value: unknown) => [`${value} kcal`, "Calories"]}
              labelFormatter={(label: unknown) => String(label)}
              contentStyle={{
                borderRadius: 12,
                borderColor: "#e2e8f0",
                fontSize: 12,
              }}
            />

            {/* Bars */}
            <Bar
              dataKey="calories"
              barSize={28}
              radius={[6, 6, 6, 6]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.dateISO}
                  fill={
                    index === selectedIndex
                      ? "#3b82f6" // highlighted bar (blue)
                      : "#22c55e" // normal green bars
                  }
                  opacity={index === selectedIndex ? 0.85 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats footer */}
      <div className="mt-6 grid gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3 text-xs text-slate-700 sm:grid-cols-3">
        <div>
          <div className="text-[11px] text-slate-500">Average</div>
          <div className="text-sm font-semibold">
            {Math.round(average)} kcal
          </div>
        </div>
        <div>
          <div className="text-[11px] text-slate-500">Highest</div>
          <div className="text-sm font-semibold">{highest} kcal</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-500">Lowest</div>
          <div className="text-sm font-semibold">{lowest} kcal</div>
        </div>
      </div>
    </section>
  );
}
