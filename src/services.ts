import { GoogleGenAI } from "@google/genai";
import { SoilData, WeatherData, Language } from "./types";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function getGeminiResponse(
  prompt: string,
  language: Language,
  context: { soil: SoilData | null; weather: WeatherData | null; location: string }
) {
  if (!API_KEY) return "Gemini API key is missing.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const languageNames: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    mr: 'Marathi',
    te: 'Telugu',
    ta: 'Tamil',
    gu: 'Gujarati',
    kn: 'Kannada'
  };
  const languageName = languageNames[language] || 'English';

  const systemInstruction = `
    You are KisanMitra, an expert Indian agricultural assistant.
    Always reply in ${languageName}.
    Keep answers short, practical, and jargon-free — farmer-friendly.
    Current context:
    - Location: ${context.location}
    - Soil: pH=${context.soil?.ph}, N=${context.soil?.nitrogen}mg/kg
    - Weather: ${context.weather?.temp}°C, Humidity ${context.weather?.humidity}%
    Answer only farming-related questions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
      },
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now.";
  }
}

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, backoff = 2000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    
    if (response.status === 503 && retries > 0) {
      console.warn(`Service 503, retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (err) {
    clearTimeout(id);
    if (retries > 0) {
      console.warn(`Fetch failed, retrying in ${backoff}ms...`, err);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
}

export async function fetchSoilData(lat: number, lng: number): Promise<SoilData> {
  try {
    // Using SoilGrids API
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&property=phh2o,nitrogen,soc,clay,sand,silt&depth=0-5cm&value=mean`;
    const res = await fetchWithRetry(url);
    const data = await res.json();

    const props = data.properties.layers;
    const getVal = (key: string) => props.find((l: any) => l.name === key)?.depths[0].values.mean / 10 || 0;

    return {
      ph: getVal('phh2o') || 6.5,
      nitrogen: getVal('nitrogen') || 50,
      soc: getVal('soc') || 20,
      sand: getVal('sand') || 40,
      silt: getVal('silt') || 40,
      clay: getVal('clay') || 20,
      texture: 'Loamy',
      isEstimated: false
    };
  } catch (err) {
    console.warn("SoilData fallback used due to API error:", err);
    return { 
      ph: 6.5, 
      nitrogen: 50, 
      soc: 20, 
      sand: 40, 
      silt: 40, 
      clay: 20, 
      texture: 'Loamy',
      isEstimated: true 
    };
  }
}

export async function fetchWeatherData(lat: number, lng: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,rain&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3`;
    const res = await fetchWithRetry(url);
    const data = await res.json();

    const current = data.current;
    const code = current.weather_code;

    const weatherMap: { [key: number]: { desc: string, icon: string } } = {
      0: { desc: 'Clear sky', icon: '01d' },
      1: { desc: 'Mainly clear', icon: '02d' },
      2: { desc: 'Partly cloudy', icon: '03d' },
      3: { desc: 'Overcast', icon: '04d' },
      45: { desc: 'Fog', icon: '50d' },
      48: { desc: 'Depositing rime fog', icon: '50d' },
      51: { desc: 'Light drizzle', icon: '09d' },
      53: { desc: 'Moderate drizzle', icon: '09d' },
      55: { desc: 'Dense drizzle', icon: '09d' },
      61: { desc: 'Slight rain', icon: '10d' },
      63: { desc: 'Moderate rain', icon: '10d' },
      65: { desc: 'Heavy rain', icon: '10d' },
      71: { desc: 'Slight snow fall', icon: '13d' },
      73: { desc: 'Moderate snow fall', icon: '13d' },
      75: { desc: 'Heavy snow fall', icon: '13d' },
      95: { desc: 'Thunderstorm', icon: '11d' },
    };

    const weatherInfo = weatherMap[code] || { desc: 'Unknown', icon: '01d' };

    const forecast = data.daily.time.map((time: string, i: number) => {
      const dayCode = data.daily.weather_code[i];
      const dayInfo = weatherMap[dayCode] || { desc: 'Unknown', icon: '01d' };
      return {
        date: time,
        high: data.daily.temperature_2m_max[i],
        low: data.daily.temperature_2m_min[i],
        rainProb: data.daily.precipitation_probability_max[i],
        description: dayInfo.desc,
        icon: dayInfo.icon
      };
    });

    return {
      temp: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rain: current.rain || 0,
      description: weatherInfo.desc,
      icon: weatherInfo.icon,
      windSpeed: current.wind_speed_10m,
      isEstimated: false,
      forecast
    };
  } catch (err) {
    console.warn("WeatherData fallback used due to API error:", err);
    return { 
      temp: 25, 
      humidity: 60, 
      rain: 0, 
      description: 'Clear', 
      icon: '01d', 
      windSpeed: 5,
      isEstimated: true,
      forecast: []
    };
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetchWithRetry(url, {
      headers: { 'User-Agent': 'KisanSense-App/1.0' }
    });
    const data = await res.json();
    return data.address?.city || data.address?.district || data.address?.state || "Unknown Location";
  } catch (err) {
    console.warn("Geocode fallback used due to API error:", err);
    return "Unknown Location";
  }
}
