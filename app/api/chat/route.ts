import { google } from '@ai-sdk/google';
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
} from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

const weatherApiKey = process.env.OPENWEATHER_API_KEY;

// ---------- TOOLS ---------------------------------------------------

const tools = {
  // 1) Weather tool: fetches current weather data for a given city
  checkWeather: tool({
    description:
      'Get the current weather in a city using OpenWeatherMap.',
    inputSchema: z.object({
      city: z
        .string()
        .describe('City name, e.g. "Berlin" or "London".'),
      units: z
        .enum(['metric', 'imperial'])
        .default('metric')
        .describe(
          'Temperature units: "metric" for Celsius, "imperial" for Fahrenheit.',
        ),
    }),
    async execute({ city, units }) {
      // Ensure that the API key is configured on the server
      if (!weatherApiKey) {
        return {
          type: 'weather',
          error:
            'Weather API key is not configured on the server.',
        };
      }

      // Build OpenWeatherMap API request URL
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city,
      )}&appid=${weatherApiKey}&units=${units}`;

      const res = await fetch(url);

      // Handle non-successful HTTP responses
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

      // Normalized weather payload returned to the calling model
      return {
        type: 'weather',
        city: cityName,
        description,
        temperature: temp,
        feelsLike,
        humidity,
        units: units === 'metric' ? '°C' : '°F',
      };
    },
  }),

  // 2) Base64 helper: encodes or decodes text using Base64
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

      // Decode branch
      try {
        const decoded = Buffer.from(value, 'base64').toString('utf8');
        return {
          type: 'base64',
          direction,
          input: value,
          result: decoded,
        };
      } catch {
        // Invalid Base64 input
        return {
          type: 'base64',
          direction,
          input: value,
          error: 'Invalid base64 string for decoding.',
        };
      }
    },
  }),
};

// ---------- MAIN HANDLER -------------------------------------------

export async function POST(req: Request) {
  // Request body contains UI messages and an optional tone setting
  const { messages, tone }: { messages: UIMessage[]; tone?: string } =
    await req.json();

  // Current date, injected into the system prompt for temporal context
  const now = new Date();
  const isoDate = now.toISOString().slice(0, 10);
  const humanDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Base system prompt describing general behavior and tools
  const baseSystem =
    `You are a knowledgeable general AI assistant. ` +
    `You can answer questions on any topic using your own knowledge, including healthy eating, wellness, lifestyle, and more. ` +
    `You ALSO have access to two optional tools: "checkWeather" (for current weather) and "base64" (for encoding/decoding text). ` +
    `Use these tools only when they are helpful, but NEVER say that your abilities are limited to these tools. ` +
    `When it fits the context, you may add a few relevant emojis (for example 😊, 💪, 🥦, 🧠, 🌤️) to make responses warmer and more engaging, but do not overuse them. ` +
    `Today is ${humanDate} (ISO ${isoDate}). Always use this as the current date when the user asks about "today".`;

  // System prompt is adjusted depending on the requested tone
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

  // Streaming text generation with tool support
  const result = streamText({
    model: google('gemini-2.5-flash'),
    system,
    messages: convertToModelMessages(messages),
    tools,
    // Higher temperature encourages more varied and expressive answers
    temperature: 1.8,
  });

  // Return a streamed UI-compatible response
  return result.toUIMessageStreamResponse();
}
