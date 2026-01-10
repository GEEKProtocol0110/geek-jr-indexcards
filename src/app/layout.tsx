import "./globals.css";

export const metadata = {
  title: "Geek Jr Index Cards",
  description: "Pre-reading index cards + spaced repetition loop."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white">
        <div className="max-w-3xl mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
