import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

export interface CityContent {
  name: string;
  history: string;
  curiosities: string[];
  attractions: { name: string; description: string }[];
  restaurants: { name: string; type: string; description: string }[];
  hotels: { name: string; range: string; description: string }[];
  commerce: { name: string; type: string; description: string }[];
  positives: string[];
  negatives: string[];
  prices: {
    flightEstimation: string;
    hotelAverage: string;
    dailyExpense: string;
  };
}

export interface Itinerary {
  days: number;
  schedule: { day: number; activities: { time: string; activity: string; description: string }[] }[];
}

export async function getCityContent(cityName: string): Promise<CityContent> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `For the city of "${cityName}", provide a comprehensive travel guide in JSON format. 
    Include: 
    - history (a short paragraph in Portuguese)
    - curiosities (at least 3 facts in Portuguese)
    - attractions (top 5 spots)
    - restaurants (top 3)
    - hotels (top 3)
    - commerce (top 3)
    - positives (at least 3 pros)
    - negatives (at least 2 cons)
    - prices (realistic estimations in BRL).
    
    All text must be in Portuguese (pt-BR).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          history: { type: Type.STRING },
          curiosities: { type: Type.ARRAY, items: { type: Type.STRING } },
          attractions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } } },
          restaurants: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING } } } },
          hotels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, range: { type: Type.STRING }, description: { type: Type.STRING } } } },
          commerce: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING } } } },
          positives: { type: Type.ARRAY, items: { type: Type.STRING } },
          negatives: { type: Type.ARRAY, items: { type: Type.STRING } },
          prices: { type: Type.OBJECT, properties: { flightEstimation: { type: Type.STRING }, hotelAverage: { type: Type.STRING }, dailyExpense: { type: Type.STRING } } },
        },
      },
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text);
}

export async function getItinerary(cityName: string, days: number): Promise<Itinerary> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a personalized itinerary for ${days} days in "${cityName}". Output JSON in pt-BR.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: { type: Type.NUMBER },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text);
}
