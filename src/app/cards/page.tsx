"use client";

import { useEffect, useState } from "react";
import CardPlayer from "@/components/CardPlayer";
import deck from "@/data/decks/starter-30.json";

type Settings = {
  sessionSize: 3 | 5 | 10;
  timeLimitSec: 60 | 120 | 180;
};

const SETTINGS_KEY = "geekjr_settings_v1";

function loadSettings(): Settings {
  if (typeof window === "undefined") return { sessionSize: 5, timeLimitSec: 120 };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { sessionSize: 5, timeLimitSec: 120 };
  } catch {
    return { sessionSize: 5, timeLimitSec: 120 };
  }
}

function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export default function CardsPage() {
  const cards = (deck as any)?.cards ?? [];
  const [settings, setSettings] = useState<Settings>({ sessionSize: 5, timeLimitSec: 120 });

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black">Session</h1>
        <p className="opacity-80">
          Keep it short: 1–3 minutes. End happy.
        </p>
      </header>

      <section className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Session Size</label>
            <div className="flex gap-2">
              {[3, 5, 10].map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ sessionSize: size as 3 | 5 | 10 })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    settings.sessionSize === size
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {size} cards
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time Limit</label>
            <div className="flex gap-2">
              {[60, 120, 180].map((time) => (
                <button
                  key={time}
                  onClick={() => updateSettings({ timeLimitSec: time as 60 | 120 | 180 })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    settings.timeLimitSec === time
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {Math.floor(time / 60)} min
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CardPlayer cards={cards} sessionSize={settings.sessionSize} timeLimitSec={settings.timeLimitSec} />
    </main>
  );
}
