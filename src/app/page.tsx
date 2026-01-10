import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-black">Geek Jr — Index Cards</h1>
        <p className="opacity-80">
          1-year-old pre-reading loop: show word, say it, prompt, mark progress.
        </p>
      </header>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
        <div className="font-semibold">The loop</div>
        <ol className="list-decimal list-inside opacity-85 space-y-1">
          <li>Show card</li>
          <li>Say the word (tap 🔊)</li>
          <li>Parent prompt (point / repeat / act)</li>
          <li>Mark: “Got it” or “Not yet”</li>
        </ol>
      </div>

      <div className="flex gap-3">
        <Link
          href="/cards"
          className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/25 border border-white/10 font-semibold"
        >
          Start session →
        </Link>
        <Link
          href="/deck"
          className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10"
        >
          <Link
  href="/parent"
  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10"
>
  Parent Mode
</Link>

          View deck
        </Link>
      </div>
    </main>
  );
}
