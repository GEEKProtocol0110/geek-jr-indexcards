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

export default function CardsPage() {
  const cards = (deck as any)?.cards ?? [];
  const [settings, setSettings] = useState<Settings>({ sessionSize: 5, timeLimitSec: 120 });

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-black">Session</h1>
      <p className="opacity-80">
        Keep it short: 1–3 minutes. End happy.
      </p>

      <CardPlayer cards={cards} sessionSize={settings.sessionSize} timeLimitSec={settings.timeLimitSec} />
    </main>
  );
}
