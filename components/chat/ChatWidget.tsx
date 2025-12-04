'use client';

import { useState } from 'react';
import { ChatPanel } from './ChatPanel';

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-300/60 hover:bg-emerald-600 transition"
        aria-label="Open chat"
      >
        💬
      </button>

      {/* chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[90vw] rounded-3xl bg-white shadow-2xl shadow-emerald-200/80 border border-emerald-100 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-emerald-50">
            <span className="text-xs font-semibold text-emerald-800">
              AI Assistant
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
          <ChatPanel compact />
        </div>
      )}
    </>
  );
}
