import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata = {
  title: "Geek Jr Index Cards",
  description: "Pre-reading index cards + spaced repetition loop."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white relative overflow-x-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)`,
            backgroundSize: '400px 400px'
          }} />
        </div>
        
        <Navigation />
        
        <div className="relative max-w-4xl mx-auto p-6 min-h-screen pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
