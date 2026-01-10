"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navigation() {
  const [pathname, setPathname] = useState("/");
  
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/cards", label: "Practice", icon: "🎯" },
    { href: "/deck", label: "Browse", icon: "📚" },
    { href: "/parent", label: "Settings", icon: "⚙️" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
            Geek Jr
          </Link>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  pathname === item.href
                    ? 'bg-white/20 text-white shadow-lg scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}