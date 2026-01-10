import deck from "@/data/decks/starter-30.json";
import Link from "next/link";

export default function DeckPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">{deck.name}</h1>
          <p className="opacity-80 mt-2">{deck.cards.length} cards total</p>
        </div>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
        >
          ← Back home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deck.cards.map((c) => (
          <div key={c.id} className="group rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-5 hover:border-white/30 transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <div className="text-xs uppercase tracking-widest opacity-70 mb-2 font-semibold">{c.category}</div>
            <div className="text-3xl font-black mb-3">{c.word}</div>
            <div className="text-sm opacity-70 leading-relaxed">{c.prompt}</div>
            {c.soundHint && (
              <div className="text-xs opacity-60 mt-2 italic">"{c.soundHint}"</div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
