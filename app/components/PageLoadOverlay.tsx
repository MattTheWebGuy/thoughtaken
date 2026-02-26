"use client";

import { useEffect, useState } from "react";

export default function PageLoadOverlay() {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const startFade = () => {
      setFadeOut(true);
      window.setTimeout(() => {
        setHidden(true);
      }, 1200);
    };

    if (document.readyState === "complete") {
      startFade();
      return;
    }

    window.addEventListener("load", startFade, { once: true });
    return () => window.removeEventListener("load", startFade);
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-90 bg-black transition-opacity duration-1200 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    />
  );
}
