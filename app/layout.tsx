// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import { NavAuthButtons } from "../components/NavAuthButtons";

export const metadata = {
  title: "WellBalance",
  description: "Wellness tracker",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50/30 to-teal-50/20">
        {/* Main navigation bar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-green-100/50 shadow-lg shadow-green-100/20">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo and brand text */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg shadow-green-300/40">
                <span className="text-white text-lg font-semibold">W</span>
              </div>
              <div>
                <h1 className="text-green-700 font-semibold leading-tight">
                  Wellness Tracker
                </h1>
                <p className="text-xs text-gray-500">Your health journey</p>
              </div>
            </div>

            {/* Primary navigation links */}
            <nav className="flex gap-2 text-sm">
              <Link
                href="/"
                className="px-4 py-2 rounded-full border border-green-200/60 text-green-700 hover:bg-green-50 hover:border-green-300 shadow-xs hover:shadow-md transition-all duration-200"
              >
                Home
              </Link>

              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full border border-green-200/60 text-green-700 hover:bg-green-50 hover:border-green-300 shadow-xs hover:shadow-md transition-all duration-200"
              >
                Dashboard
              </Link>

              <Link
                href="/profile"
                className="px-4 py-2 rounded-full border border-green-200/60 text-green-700 hover:bg-green-50 hover:border-green-300 shadow-xs hover:shadow-md transition-all duration-200"
              >
                Profile
              </Link>

              {/* Authentication-aware button (Login / Logout) */}
              <NavAuthButtons />
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
