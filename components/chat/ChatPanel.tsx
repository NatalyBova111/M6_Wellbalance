// components/chat/ChatPanel.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type Tone = "neutral" | "casual" | "formal" | "pirate";

const STORAGE_KEY = "chat-history";

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [tone, setTone] = useState<Tone>("neutral");
  const [input, setInput] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { tone },
    }),
  });

  // 1) 
  useEffect(() => {
    if (historyLoaded) return;
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHistoryLoaded(true);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setMessages(parsed);
      }
    } catch {
 
    } finally {
      setHistoryLoaded(true);
    }
  }, [historyLoaded, setMessages]);

  // 2) 
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!historyLoaded) return;

    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages, historyLoaded]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTone(e.target.value as Tone);
  };

  return (
    <div
      className={`flex flex-col ${
        compact ? "h-96" : "h-[calc(100vh-4rem)]"
      } max-w-full`}
    >
    
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2 bg-emerald-50">
  

        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-slate-500">Tone:</span>
          <select
            value={tone}
            onChange={handleToneChange}
            className="rounded-full border px-2 py-1 text-[10px] text-slate-700 bg-white"
          >
            <option value="neutral">Neutral</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="pirate">Pirate 🏴‍☠️</option>
          </select>
        </div>
      </div>

  
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs bg-white">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 ${
                m.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-900"
              }`}
            >
              {m.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-xs text-slate-500">
            Ask anything about nutrition, wellness or daily habits ✨
          </div>
        )}
      </div>

   
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t px-3 py-2 bg-white/90"
      >
        <input
          className="flex-1 rounded-xl border px-3 py-1.5 text-xs outline-none"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
        />
        <button
          type="submit"
          disabled={status !== "ready" || !input.trim()}
          className="rounded-xl px-3 py-1.5 text-xs font-medium border bg-slate-900 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
