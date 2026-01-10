"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import deck from "@/data/decks/starter-30.json";
import { loadState, resetState, saveState } from "@/lib/storage";
import { getDefaultState } from "@/lib/leitner";

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

function saveSettings(s: Settings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export default function ParentPage() {
  const cards = (deck as any)?.cards ?? [];
  const [settings, setSettings] = useState<Settings>({ sessionSize: 5, timeLimitSec: 120 });
  const [stateMap, setStateMap] = useState<Record<string, any>>({});

  useEffect(() => {
    setSettings(loadSettings());
    setStateMap(loadState());
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const stats = useMemo(() => {
    const boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>;
    let totalSeen = 0;

    for (const c of cards) {
      const s = stateMap[c.id] ?? getDefaultState();
      boxCounts[s.box] += 1;
      totalSeen += s.seenCount ?? 0;
    }

    return { boxCounts, totalSeen };
  }, [cards, stateMap]);

  function handleResetProgress() {
    resetState();
    // also rebuild in-memory view
    setStateMap({});
  }

  // Optional: "prime" state so all cards have entries (useful for stats)
  function initializeAllCards() {
    const next = { ...stateMap };
    for (const c of cards) {
      if (!next[c.id]) next[c.id] = getDefaultState();
    }
    setStateMap(next);
    saveState(next);
  }

  return (
    <main className="space-y-8">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Parent Mode</h1>
            <p className="opacity-80 mt-2">
              Adjust settings and track progress. Keep it short and happy.
            </p>
          </div>
          <Link
            href="/cards"
            className="px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-200 transition-colors"
          >
            Back to session →
          </Link>
        </div>
      </header>

      <section className="rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <span className="text-green-400 font-bold">⚙️</span>
          </div>
          <h2 className="text-xl font-semibold">Session Settings</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-sm font-medium opacity-80">Daily cards</div>
            <div className="flex gap-3">
              {[3, 5, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setSettings((s) => ({ ...s, sessionSize: n as 3 | 5 | 10 }))}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    settings.sessionSize === n
                      ? "bg-blue-500/30 border-blue-500/50 text-blue-200 shadow-lg scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  {n} cards
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium opacity-80">Timer</div>
            <div className="flex gap-3">
              {[60, 120, 180].map((n) => (
                <button
                  key={n}
                  onClick={() => setSettings((s) => ({ ...s, timeLimitSec: n as 60 | 120 | 180 }))}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-200 ${
                    settings.timeLimitSec === n
                      ? "bg-purple-500/30 border-purple-500/50 text-purple-200 shadow-lg scale-105"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  {n === 60 ? "1 min" : n === 120 ? "2 min" : "3 min"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/10">
          <div className="text-sm opacity-70">
            Current: <span className="font-semibold text-white">{settings.sessionSize}</span> cards /{" "}
            <span className="font-semibold text-white">{Math.floor(settings.timeLimitSec / 60)}</span> minutes
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
        <div className="text-lg font-semibold">Progress & Stats</div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
            <div className="text-sm opacity-70">Deck size</div>
            <div className="text-2xl font-black">{cards.length} cards</div>
          </div>

          <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
            <div className="text-sm opacity-70">Total “seen” taps</div>
            <div className="text-2xl font-black">{stats.totalSeen}</div>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 border border-white/10 p-4 space-y-3">
          <div className="text-sm opacity-70">Leitner boxes (1–5)</div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((b) => (
              <div key={b} className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                <div className="text-xs opacity-70">Box {b}</div>
                <div className="text-xl font-black">{stats.boxCounts[b]}</div>
              </div>
            ))}
          </div>

          <div className="text-xs opacity-60">
            Box 1 = most frequent practice. Box 5 = long-term memory.
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={initializeAllCards}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
          >
            Initialize deck tracking
          </button>

          <button
            onClick={handleResetProgress}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
          >
            Reset progress
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 p-6 md:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <span className="text-yellow-400 font-bold">💡</span>
          </div>
          <h2 className="text-xl font-semibold">Pro tip</h2>
        </div>
        <p className="opacity-80 text-lg leading-relaxed">
          At 1 year old, stop sessions early. The goal is a happy association with words.
          Keep it fun and celebrate small victories!
        </p>
      </section>
    </main>
  );
}
