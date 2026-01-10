"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Card } from "@/lib/types";
import { loadState, saveState, resetState } from "@/lib/storage";
import { getDefaultState, isDue, markResult } from "@/lib/leitner";
import { ProgressBar } from "./ProgressBar";

function speak(text: string, isPreview = false) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  if (isPreview) {
    u.rate = 0.6;
    u.pitch = 1.2;
  } else {
    u.rate = 0.9;
    u.pitch = 1.0;
  }
  synth.speak(u);
}

export default function CardPlayer({
  cards,
  sessionSize = 5,
  timeLimitSec = 120,
}: {
  cards: Card[];
  sessionSize?: number;
  timeLimitSec?: number;
}) {
  const router = useRouter();
  const [stateMap, setStateMap] = useState<Record<string, any>>({});
  const [sessionDone, setSessionDone] = useState(false);
  const [idx, setIdx] = useState(0);

  // Timer
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSec);
  const [paused, setPaused] = useState(false);

  // ✅ Always use a safe array so hooks don't depend on early returns
  const safeCards = Array.isArray(cards) ? cards : [];

  useEffect(() => {
    setStateMap(loadState());
  }, []);

  // Reset timer when timeLimit changes (or when component mounts)
  useEffect(() => {
    setSecondsLeft(timeLimitSec);
  }, [timeLimitSec]);

  // Timer tick
  useEffect(() => {
    if (sessionDone || paused) return;

    if (secondsLeft <= 0) {
      setSessionDone(true);
      return;
    }

    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, paused, sessionDone]);

  // ✅ Daily session selection: due cards first, else shuffled fallback, then slice(sessionSize)
  const dueCards = useMemo(() => {
    const now = Date.now();
    const withState = safeCards.map((c) => {
      const s = stateMap[c.id] ?? getDefaultState();
      return { card: c, s };
    });

    const due = withState
      .filter(({ s }) => isDue(s, now))
      .map((x) => x.card);

    const pool = due.length ? due : [...safeCards].sort(() => Math.random() - 0.5);

    return pool.slice(0, Math.max(1, sessionSize));
  }, [safeCards, stateMap, sessionSize]);

  // ✅ clamp idx if list changes
  useEffect(() => {
    if (idx >= dueCards.length) setIdx(0);
  }, [dueCards.length, idx]);

  // If deck/session changes, clear completion state
  useEffect(() => {
    setSessionDone(false);
  }, [dueCards.length]);

  // ✅ Guards AFTER hooks
  if (safeCards.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-2">No cards found</h2>
        <p className="opacity-80">
          Your page is passing an empty array into CardPlayer.
        </p>
      </div>
    );
  }

  if (!dueCards.length) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-2">No due cards</h2>
        <p className="opacity-80">Try “Reset progress” to start over.</p>
      </div>
    );
  }

  const current = dueCards[idx];
  const total = dueCards.length;
  const doneCount = idx;

  function updateCard(correct: boolean) {
    if (!current) return;

    const prev = stateMap[current.id] ?? getDefaultState();
    const next = markResult(prev, correct);
    const nextMap = { ...stateMap, [current.id]: next };

    setStateMap(nextMap);
    saveState(nextMap);

    const nextIdx = idx + 1;
    if (nextIdx >= total) {
      setSessionDone(true);
    } else {
      setIdx(nextIdx);
    }
  }

  function restartSession() {
    setIdx(0);
    setSessionDone(false);
    setSecondsLeft(timeLimitSec);
    setPaused(false);
  }

  function hardReset() {
    resetState();
    setStateMap({});
    setIdx(0);
    setSessionDone(false);
    setSecondsLeft(timeLimitSec);
    setPaused(false);
  }

  if (!current) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-2">Loading…</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timer + session size UI */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="text-sm opacity-80">
          Daily session: <span className="font-semibold text-white">{total}</span> cards
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm opacity-80">
            Time:{" "}
            <span className="font-semibold text-white">
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={() => setPaused((p) => !p)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              paused
                ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-200'
                : 'bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-200'
            }`}
          >
            {paused ? "▶️ Resume" : "⏸️ Pause"}
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl font-semibold transition-all bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-200"
          >
            🚪 Exit
          </button>
        </div>
      </div>

      <ProgressBar value={doneCount} max={total} />

      <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <div className="text-sm uppercase tracking-widest opacity-70 mb-2">
              {current.category ?? "Deck"}
            </div>
            <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
              {current.word}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => speak(current.word)}
              className="px-6 py-3 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-200 font-semibold transition-colors"
            >
              🔊 Word
            </button>
            <button
              onClick={() => speak(current.soundHint || current.word, true)}
              className="px-6 py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-200 font-semibold transition-colors"
            >
              🔊 Hint
            </button>
          </div>
        </div>

        {/* Optional image support */}
        {current.image && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/20 bg-black/20 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={current.word}
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="rounded-2xl bg-black/30 p-5 border border-white/20">
            <div className="text-sm opacity-70 mb-2">Parent Prompt</div>
            <div className="text-lg md:text-xl font-medium">
              {current.prompt ??
                "Say the word slowly. Ask them to point or repeat."}
            </div>
          </div>

          {current.soundHint && (
            <div className="text-sm opacity-75 bg-white/5 rounded-lg p-3 border border-white/10">
              Sound hint: <span className="font-semibold text-white">{current.soundHint}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => updateCard(false)}
            className="flex-1 px-6 py-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 font-semibold transition-all hover:scale-105"
          >
            Not yet
          </button>
          <button
            onClick={() => updateCard(true)}
            className="flex-1 px-6 py-4 rounded-2xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-200 font-semibold transition-all hover:scale-105"
          >
            Got it ✅
          </button>
        </div>
      </div>

      {sessionDone && (
        <div className="rounded-2xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 p-6 text-center">
          <div className="text-2xl font-bold mb-2 text-green-200">Session complete 🎉</div>
          <p className="opacity-80 mb-6 text-lg">
            End happy. Come back tomorrow for your next Daily {sessionSize}.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartSession}
              className="px-6 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-200 font-semibold transition-colors"
            >
              🔄 Run again
            </button>
            <button
              onClick={hardReset}
              className="px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 font-semibold transition-colors"
            >
              🔄 Reset progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
