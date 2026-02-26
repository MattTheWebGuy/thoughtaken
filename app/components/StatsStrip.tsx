"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SITE_CONFIG } from "../lib/site-config";

type CounterKind = "million" | "billion" | "integer";

type CounterConfig = {
  label: string;
  rawValue: string;
  kind: CounterKind;
  start: number;
  target: number;
  increment: number;
  plus: boolean;
};

const ANIMATION_DURATION_MS = 1400;

function parseCounter(item: { label: string; value: string }): CounterConfig {
  const rawValue = item.value.trim();
  const plus = rawValue.includes("+");

  if (rawValue.toUpperCase().includes("B")) {
    const targetBillions = Number.parseFloat(rawValue);
    return {
      label: item.label,
      rawValue,
      kind: "billion",
      start: 100,
      target: Math.round(targetBillions * 1000),
      increment: 100,
      plus,
    };
  }

  if (rawValue.toUpperCase().includes("M")) {
    const targetMillions = Number.parseFloat(rawValue);
    return {
      label: item.label,
      rawValue,
      kind: "million",
      start: 1.1,
      target: targetMillions,
      increment: 0.1,
      plus,
    };
  }

  const target = Number.parseFloat(rawValue);
  return {
    label: item.label,
    rawValue,
    kind: "integer",
    start: 1,
    target,
    increment: 1,
    plus,
  };
}

function formatCounterValue(config: CounterConfig, current: number) {
  if (config.kind === "million") {
    const value = Math.min(current, config.target);
    return `${value.toFixed(1)}M${config.plus ? "+" : ""}`;
  }

  if (config.kind === "billion") {
    const value = Math.min(current, config.target);

    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}B${config.plus ? "+" : ""}`;
    }

    return `${Math.round(value)}M`;
  }

  const value = Math.min(current, config.target);
  return `${Math.round(value)}${config.plus ? "+" : ""}`;
}

export default function StatsStrip() {
  const stats = SITE_CONFIG.sections.socialProof.items;
  const counterConfigs = useMemo(() => stats.map(parseCounter), [stats]);

  const [displayValues, setDisplayValues] = useState<string[]>(() =>
    counterConfigs.map((config) => formatCounterValue(config, config.start)),
  );

  const sectionRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frameTimeout = 0;
    const intervals: number[] = [];

    const updateDisplay = (index: number, nextValue: string) => {
      setDisplayValues((current) => {
        const next = [...current];
        next[index] = nextValue;
        return next;
      });
    };

    const startAnimation = () => {
      counterConfigs.forEach((config, index) => {
        let currentValue = config.start;
        const steps = Math.max(
          1,
          Math.ceil((config.target - config.start) / config.increment),
        );
        const stepIntervalMs = Math.max(
          16,
          Math.floor(ANIMATION_DURATION_MS / steps),
        );

        const interval = window.setInterval(() => {
          currentValue = Math.min(
            config.target,
            Number((currentValue + config.increment).toFixed(2)),
          );
          updateDisplay(index, formatCounterValue(config, currentValue));

          if (currentValue >= config.target) {
            window.clearInterval(interval);
          }
        }, stepIntervalMs);

        intervals.push(interval);

        frameTimeout = window.setTimeout(() => {
          updateDisplay(index, formatCounterValue(config, config.target));
          window.clearInterval(interval);
        }, ANIMATION_DURATION_MS);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        startAnimation();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (frameTimeout) {
        window.clearTimeout(frameTimeout);
      }
      intervals.forEach((interval) => window.clearInterval(interval));
    };
  }, [counterConfigs]);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="border-y border-neutral-900 bg-neutral-950 py-3"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 sm:gap-x-8 sm:px-6 md:gap-x-10 md:px-10">
        {stats.map((item, index) => (
          <article key={item.label} className="flex items-center gap-2">
            <p className="text-base font-extrabold text-white sm:text-lg">
              {displayValues[index]}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 sm:text-xs">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
