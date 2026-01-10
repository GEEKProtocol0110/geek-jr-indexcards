"use client";

import { useEffect, useMemo, useState } from "react";
import type { Card } from "@/lib/types";
import { loadState, saveState, resetState } from "@/lib/storage";
import { getDefaultState, isDue, markResult } from "@/lib/leitner";
import { ProgressBar } from "./ProgressBar";

function speak(text: string) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
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
      <div className="flex items-center justify-between text-sm opacity-80">
        <div>
          Daily session: <span className="font-semibold">{total}</span> cards
        </div>

        <div className="flex items-center gap-3">
          <span>
            Time:{" "}
            <span className="font-semibold">
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </span>
          </span>

          <button
            onClick={() => setPaused((p) => !p)}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      <ProgressBar value={doneCount} max={total} />

      <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-widest opacity-70">
              {current.category ?? "Deck"}
            </div>
            <div className="text-5xl md:text-6xl font-black mt-2">
              {current.word}
            </div>
          </div>

          <button
            onClick={() => speak(current.word)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
          >
            🔊 Say
          </button>
        </div>

        {/* Optional image support */}
        {current.image && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={current.word}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-black/20 p-4 border border-white/10">
            <div className="text-sm opacity-70 mb-1">Parent Prompt</div>
            <div className="text-lg">
              {current.prompt ??
                "Say the word slowly. Ask them to point or repeat."}
            </div>
          </div>

          {current.soundHint && (
            <div className="text-sm opacity-75">
              Sound hint:{" "}
              <span className="font-semibold">{current.soundHint}</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <button
            onClick={() => updateCard(false)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
          >
            Not yet
          </button>
          <button
            onClick={() => updateCard(true)}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/25 border border-white/10 font-semibold"
          >
            Got it ✅
          </button>
        </div>
      </div>

      {sessionDone && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <div className="text-xl font-semibold mb-2">Session complete 🎉</div>
          <p className="opacity-80 mb-4">
            End happy. Come back tomorrow for your next Daily {sessionSize}.
          </p>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={restartSession}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
            >
              Run again
            </button>
            <button
              onClick={hardReset}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
            >
              Reset progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
