// app/chat/page.tsx
"use client";

import { ChatPanel } from "@/components/chat/ChatPanel";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 flex justify-center">
      <ChatPanel />
    </div>
  );
}
