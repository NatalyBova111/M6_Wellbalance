// app/page.tsx
import Link from 'next/link';

const tools = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'Track your daily calorie intake, macros, mood, and overall wellness progress.',
    href: '/dashboard',
    button: 'Open Dashboard',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'meals',
    title: 'Add Meal',
    description:
      'Log your meals and snacks to stay on top of your nutrition goals.',
    href: '/dashboard/meals',
    button: 'Open Add Meals',
    color: 'from-orange-400 to-amber-500',
  },
  {
    id: 'water-sleep',
    title: 'Water & Sleep',
    description:
      'Monitor your hydration levels and sleep patterns for better health.',
    href: '/dashboard',
    button: 'Open Water & Sleep',
    color: 'from-sky-400 to-cyan-500',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50/40 to-teal-50/30">
      {/* декоративные пятна фона */}
      <div className="pointer-events-none fixed inset-y-0 right-0 w-80 translate-x-1/3 bg-linear-to-bl from-emerald-200/40 to-transparent blur-3xl" />
      <div className="pointer-events-none fixed inset-y-0 left-0 w-80 -translate-x-1/3 bg-linear-to-tr from-teal-200/40 to-transparent blur-3xl" />

      <main className="relative mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-white/80 shadow-xl shadow-emerald-100/60 ring-1 ring-emerald-100 backdrop-blur-sm">
          <div className="grid gap-6 p-6 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)] sm:p-8">
            <div className="flex flex-col justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Wellness Tracker
              </div>

              <div>
                <h1 className="mb-2 text-2xl font-semibold text-emerald-900 sm:text-3xl">
                  Welcome back!
                </h1>
                <p className="max-w-md text-sm text-slate-600 sm:text-base">
                  Track your nutrition, stay hydrated, and maintain healthy sleep habits.
                  Now you can also chat with the AI assistant for extra guidance.
                </p>
              </div>

              <div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-300/50 transition hover:shadow-emerald-400/60"
                >
                  View Dashboard
                </Link>
              </div>
            </div>

            {/* картинка */}
 <div className="relative">
  <div className="h-full w-full rounded-2xl bg-linear-to-br from-emerald-100 via-green-100 to-emerald-50 p-1">
    <div className="flex h-full items-center justify-center rounded-2xl bg-[url('/Photo1.jpg')] bg-cover bg-center" />
  </div>
</div>

          </div>
        </section>

        {/* Your Wellness Tools */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Your Wellness Tools
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex flex-col rounded-2xl bg-white/90 p-4 shadow-md shadow-emerald-100 ring-1 ring-emerald-100/70 backdrop-blur-sm"
              >
                <div className="mb-3 h-1.5 w-14 rounded-full bg-linear-to-r from-emerald-300 to-green-300" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {tool.title}
                </h3>
                <p className="mt-2 flex-1 text-xs text-slate-600">
                  {tool.description}
                </p>
                <Link
                  href={tool.href}
                  className={`mt-4 inline-flex items-center justify-center rounded-full bg-linear-to-r ${tool.color} px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200/70 transition hover:shadow-lg`}
                >
                  {tool.button}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* AI Chat Assistant — теперь ниже */}
{/* AI Chat Assistant link block */}
<section>
  <Link href="/chat">
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-emerald-100 hover:bg-emerald-50 transition">
      <div className="flex items-center gap-3">
        <span className="text-xl text-emerald-600">💬</span>
        <div>
          <h3 className="text-sm font-semibold text-emerald-800">
            AI Chat Assistant
          </h3>
          <p className="text-xs text-slate-600">
            Tap to start chatting instantly.
          </p>
        </div>
      </div>

      <span className="text-lg text-emerald-600">→</span>
    </div>
  </Link>
</section>




      </main>
    </div>
  );
}
