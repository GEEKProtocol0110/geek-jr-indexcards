import deck from "@/data/decks/starter-30.json";

export default function DeckPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-black">{deck.name}</h1>
      <p className="opacity-80">{deck.cards.length} cards</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {deck.cards.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm uppercase tracking-widest opacity-70">{c.category}</div>
            <div className="text-2xl font-black mt-1">{c.word}</div>
            <div className="text-sm opacity-70 mt-2">{c.prompt}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
