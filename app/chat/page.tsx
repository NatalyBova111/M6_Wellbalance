'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { FormEvent, useState, ChangeEvent, ReactNode } from 'react';

type Tone = 'neutral' | 'casual' | 'formal' | 'pirate';

type WeatherResult = {
  type: 'weather';
  city?: string;
  description?: string;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  units?: string;
  error?: string;
};

type Base64Result = {
  type: 'base64';
  direction: 'encode' | 'decode';
  input: string;
  result?: string;
  error?: string;
};

type ToolResultPart = {
  type: 'tool-result';
  toolName: string;
  result: unknown;
};

// Type guard for tool result message parts
function isToolResultPart(part: { type: string }): part is ToolResultPart {
  return part.type === 'tool-result';
}

export default function ChatPage() {
  const [tone, setTone] = useState<Tone>('neutral');
  const [input, setInput] = useState('');

  // Configure chat hook with custom transport and tone parameter
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { tone },
    }),
  });

  // Handle sending of a new chat message
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  // Handle changes in tone selector
  const handleToneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTone(e.target.value as Tone);
  };

  // Render helper for weather tool result
  const renderWeatherResult = (result?: WeatherResult): ReactNode => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          🌧️ Weather error: {result.error}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-semibold">
            🌤️ {result.city ?? 'Unknown location'}
          </span>
          {typeof result.temperature === 'number' && result.units && (
            <span className="text-sm font-semibold">
              {Math.round(result.temperature)} {result.units}
            </span>
          )}
        </div>
        {result.description && (
          <p className="capitalize text-[11px] text-emerald-800/80">
            {result.description}
          </p>
        )}
        <div className="mt-1 flex gap-4 text-[11px] text-emerald-800/80">
          {typeof result.feelsLike === 'number' && result.units && (
            <span>
              Feels like: {Math.round(result.feelsLike)} {result.units}
            </span>
          )}
          {typeof result.humidity === 'number' && (
            <span>Humidity: {result.humidity}%</span>
          )}
        </div>
      </div>
    );
  };

  // Render helper for Base64 tool result
  const renderBase64Result = (result?: Base64Result): ReactNode => {
    if (!result) return null;

    if (result.error) {
      return (
        <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">
          ⚠️ Base64 error: {result.error}
        </div>
      );
    }

    const isEncode = result.direction === 'encode';

    return (
      <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-800">
        <p className="mb-1 font-semibold">
          {isEncode ? 'Encoded value (Base64)' : 'Decoded value'}
        </p>
        <div className="rounded-md bg-slate-900/90 px-2 py-1 font-mono text-[11px] text-emerald-100 break-words">
          {result.result}
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Original:&nbsp;
          <span className="font-mono">{result.input}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col max-w-2xl mx-auto my-6 border rounded-2xl shadow-sm bg-white/80">
      {/* Settings panel: title and tone selector */}
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
        <h1 className="text-sm font-semibold text-slate-800">
          AI Chat Assistant
        </h1>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Tone:</span>
          <select
            value={tone}
            onChange={handleToneChange}
            className="rounded-full border px-2 py-1 text-xs text-slate-700 bg-white"
          >
            <option value="neutral">Neutral</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="pirate">Pirate 🏴‍☠️</option>
          </select>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`inline-block max-w-full rounded-2xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              {m.parts.map((part, i) => {
                // Plain text message content
                if (part.type === 'text') {
                  return <span key={i}>{part.text}</span>;
                }

                // Tool result content rendered in a custom way
                if (isToolResultPart(part)) {
                  const { toolName, result } = part;

                  if (toolName === 'checkWeather') {
                    return (
                      <div key={i} className="mt-1">
                        {renderWeatherResult(result as WeatherResult)}
                      </div>
                    );
                  }

                  if (toolName === 'base64') {
                    return (
                      <div key={i} className="mt-1">
                        {renderBase64Result(result as Base64Result)}
                      </div>
                    );
                  }
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {/* Empty state when no messages have been sent yet */}
        {messages.length === 0 && (
          <div className="text-sm text-slate-500">
            Choose a tone above and ask anything ✨
            <br />
            Weather queries and Base64 encoding/decoding are also supported.
          </div>
        )}
      </div>

      {/* Input form for new messages */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t p-3 bg-white/70"
      >
        <input
          className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
          placeholder="What would you like to know?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'ready'}
        />
        <button
          type="submit"
          disabled={status !== 'ready' || !input.trim()}
          className="rounded-xl px-4 py-2 text-sm font-medium border bg-slate-900 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
