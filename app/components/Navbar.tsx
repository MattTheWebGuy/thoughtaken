"use client";

import { useState } from "react";
import { BiMenuAltRight, BiX } from "react-icons/bi";
import { SITE_CONFIG } from "../lib/site-config";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900/70 bg-black/80 backdrop-blur">
      <div
        className="w-full overflow-hidden"
      >
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer font-(family-name:--font-heading) text-[1.2rem] font-bold leading-[1.2] tracking-[0.08em] text-white uppercase sm:text-[1.6rem]"
          >
            {SITE_CONFIG.branding.logoText}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            {SITE_CONFIG.navigation.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                  item.highlighted
                    ? "bg-white text-black hover:bg-gray-200"
                    : "border border-white/25 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((previous) => !previous)}
            className="cursor-pointer flex items-center justify-center rounded-full border border-neutral-700 p-2 text-white transition-colors duration-300 hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <BiX className="text-2xl" /> : <BiMenuAltRight className="text-2xl" />}
          </button>
        </nav>

        <div
          className={`overflow-hidden transition-all duration-500 md:hidden ${
            mobileOpen ? "max-h-96 border-t border-neutral-800" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-2 px-4 py-4">
            {SITE_CONFIG.navigation.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={`cursor-pointer w-full rounded-xl px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                  item.highlighted
                    ? "bg-white text-black"
                    : "border border-neutral-700 bg-neutral-950 text-gray-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
