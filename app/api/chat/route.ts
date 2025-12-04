// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
} from 'ai';
import { z } from 'zod';

import { createSupabaseServer } from '@/lib/supabaseServer';
import type { Database } from '@/database.types';

export const runtime = 'nodejs';
export const maxDuration = 30;

const weatherApiKey = process.env.OPENWEATHER_API_KEY;

// ---------- TYPES ---------------------------------------------------

type DailyLogRow = Database['public']['Tables']['daily_logs']['Row'];

type UserTargetsRow = {
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

// ---------- TOOLS ---------------------------------------------------

const tools = {
  // 1) Weather tool
  checkWeather: tool({
    description: 'Get the current weather in a city using OpenWeatherMap.',
    inputSchema: z.object({
      city: z
        .string()
        .describe('City name, e.g. "Berlin" or "London".'),
      units: z
        .enum(['metric', 'imperial'])
        .default('metric')
        .describe(
          'Temperature units: "metric" for Celsius, "imperial" for Fahrenheit.'
        ),
    }),
    async execute({ city, units }) {
      if (!weatherApiKey) {
        return {
          type: 'weather',
          error: 'Weather API key is not configured on the server.',
        };
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${weatherApiKey}&units=${units}`;

      try {
        const res = await fetch(url);

        if (!res.ok) {
          return {
            type: 'weather',
            error: `Failed to fetch weather for "${city}". Status: ${res.status}`,
          };
        }

        const data = await res.json();

        const temp = data.main?.temp;
        const feelsLike = data.main?.feels_like;
        const humidity = data.main?.humidity;
        const description =
          data.weather?.[0]?.description ?? 'No description';
        const cityName = data.name ?? city;

        return {
          type: 'weather',
          city: cityName,
          description,
          temperature: temp,
          feelsLike,
          humidity,
          units: units === 'metric' ? '°C' : '°F',
        };
      } catch (error) {
        console.error('checkWeather tool error:', error);
        return {
          type: 'weather',
          error: 'Unexpected error while fetching weather.',
        };
      }
    },
  }),

  // 2) Base64 helper
  base64: tool({
    description:
      'Encode or decode text using Base64. Use direction "encode" or "decode".',
    inputSchema: z.object({
      direction: z.enum(['encode', 'decode']),
      value: z.string().describe('The input text or Base64 string.'),
    }),
    async execute({ direction, value }) {
      if (direction === 'encode') {
        const result = Buffer.from(value, 'utf8').toString('base64');
        return {
          type: 'base64',
          direction,
          input: value,
          result,
        };
      }

      try {
        const decoded = Buffer.from(value, 'base64').toString('utf8');
        return {
          type: 'base64',
          direction,
          input: value,
          result: decoded,
        };
      } catch {
        return {
          type: 'base64',
          direction,
          input: value,
          error: 'Invalid base64 string for decoding.',
        };
      }
    },
  }),

  // 3) Get daily nutrition summary from Supabase
  getDailySummary: tool({
    description:
      'Get the total calories and macros for the current user for a given date. If no date is provided, use today.',
    inputSchema: z.object({
      date: z
        .string()
        .optional()
        .describe('ISO date YYYY-MM-DD. If omitted, use today.'),
    }),
    async execute({ date }) {
      try {
        const supabase = await createSupabaseServer();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return {
            type: 'daily_summary',
            error: 'User is not authenticated.',
          } as const;
        }

        const todayIso = new Date().toISOString().slice(0, 10);
        const targetDate = date ?? todayIso;

        const { data, error } = await supabase
          .from('daily_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('log_date', targetDate)
          .maybeSingle<DailyLogRow>();

        if (error) {
          console.error('getDailySummary error:', error);
          return {
            type: 'daily_summary',
            error: 'Failed to load daily summary.',
          } as const;
        }

        return {
          type: 'daily_summary',
          date: targetDate,
          total_calories: Number(data?.total_calories ?? 0),
          protein_g: Number(data?.protein_g ?? 0),
          carbs_g: Number(data?.carbs_g ?? 0),
          fat_g: Number(data?.fat_g ?? 0),
        } as const;
      } catch (error) {
        console.error('getDailySummary unexpected error:', error);
        return {
          type: 'daily_summary',
          error: 'Unexpected error while loading daily summary.',
        } as const;
      }
    },
  }),

  // 4) Get user calorie and macro targets
  getUserTargets: tool({
    description:
      'Get the daily calorie and macronutrient targets for the current user.',
    inputSchema: z.object({}),
    async execute() {
      try {
        const supabase = await createSupabaseServer();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          return {
            type: 'user_targets',
            error: 'User is not authenticated.',
          } as const;
        }

        // user_targets пока не типизирована, поэтому any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('user_targets')
          .select('daily_calories, protein_g, carbs_g, fat_g')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('getUserTargets error:', error);
          // вернём дефолты, но пометим как fallback
          return {
            type: 'user_targets',
            daily_calories: 2000,
            protein_g: 120,
            carbs_g: 200,
            fat_g: 60,
            note: 'Using default targets due to load error.',
          } as const;
        }

        const defaults: UserTargetsRow = {
          daily_calories: 2000,
          protein_g: 120,
          carbs_g: 200,
          fat_g: 60,
        };

        const row: UserTargetsRow = (data as UserTargetsRow | null) ?? defaults;

        return {
          type: 'user_targets',
          daily_calories: row.daily_calories,
          protein_g: row.protein_g,
          carbs_g: row.carbs_g,
          fat_g: row.fat_g,
        } as const;
      } catch (error) {
        console.error('getUserTargets unexpected error:', error);
        return {
          type: 'user_targets',
          daily_calories: 2000,
          protein_g: 120,
          carbs_g: 200,
          fat_g: 60,
          note: 'Using default targets due to unexpected error.',
        } as const;
      }
    },
  }),
} as const;

// ---------- MAIN HANDLER -------------------------------------------

export async function POST(req: Request) {
  const {
    messages,
    tone,
  }: { messages: UIMessage[]; tone?: string } = await req.json();

  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  const humanDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const baseSystem =
  `You are a helpful wellness assistant inside the WellBalance app. ` +
  `You can answer general questions about nutrition, wellness and lifestyle. ` +
  `You ALSO have access to four optional tools: "checkWeather", "base64", ` +
  `"getDailySummary" (to read the current user's daily calories and macros from the database), and ` +
  `"getUserTargets" (to read the user's daily calorie & macro targets). ` +
  `Whenever the user asks about **how many calories they have eaten today, how many are left, ` +
  `their protein/carbs/fat for a day, or their daily goals**, you MUST first call ` +
  `"getDailySummary" and/or "getUserTargets" and base your answer ONLY on those results. ` +
  `Never invent calorie or macro numbers. If the tools return an error (for example, user is not logged in), ` +
  `explain that you cannot access personal data and answer only in general terms. ` +
  `Always reply in the same language that the user used (if they write in Russian, answer in Russian). ` +
  `When it fits the context, you may add a few positive emojis (😊, 💪, 🥦), but do not overuse them. ` +
  `Today is ${humanDate} (ISO ${isoDate}). Treat this as "today" in user questions.`;


  let system = baseSystem;

  if (tone === 'casual') {
    system =
      `You are a friendly, informal assistant. You explain things simply and speak in a relaxed, conversational tone. ` +
      baseSystem;
  } else if (tone === 'formal') {
    system =
      `You are a polite, formal assistant. Use professional language and structured, clear explanations. ` +
      baseSystem;
  } else if (tone === 'pirate') {
    system =
      `You are a humorous pirate assistant. Sprinkle pirate slang like “Arrr” and “matey” while still giving accurate answers. ` +
      baseSystem;
  }

const result = streamText({
  model: google('gemini-2.5-flash'),
  system,
  messages: convertToModelMessages(messages),
  tools,
  toolChoice: 'auto',  
  temperature: 0.4,     
});


  return result.toUIMessageStreamResponse();
}
