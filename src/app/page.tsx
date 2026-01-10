import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-8">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Welcome to Pre-Reading Practice
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          A 1-year-old pre-reading loop: show the word, say it out loud, prompt,
          and track progress with spaced repetition.
        </p>
      </header>

      <section className="rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 md:p-8 shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-blue-400 font-bold">1</span>
          </div>
          <h2 className="text-xl font-semibold">The loop</h2>
        </div>
        <ol className="list-decimal list-inside opacity-85 space-y-2 text-lg">
          <li>Show a card</li>
          <li>Say the word (tap 🔊)</li>
          <li>Do the parent prompt (point / repeat / act)</li>
          <li>Tap: "Got it" or "Not yet"</li>
        </ol>
        <p className="text-sm opacity-70 mt-4 p-3 rounded-lg bg-black/20 border border-white/10">
          Keep it short (1–3 minutes). End happy.
        </p>
      </section>

      <div className="text-center">
        <p className="text-white/60 mb-4">Choose an option above to get started</p>
      </div>
    </main>
  );
}
