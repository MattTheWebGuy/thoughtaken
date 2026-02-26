"use client";

import Image from "next/image";
import { BiDownArrowAlt } from "react-icons/bi";
import { SITE_CONFIG } from "../lib/site-config";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      <Image
        src={SITE_CONFIG.images.heroMobile || SITE_CONFIG.images.hero}
        alt="Cinematic biker hero"
        fill
        priority
        sizes="100vw"
        className="object-cover sm:hidden"
      />
      <Image
        src={SITE_CONFIG.images.hero}
        alt="Cinematic biker hero"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover sm:block"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex max-w-3xl -translate-y-6 flex-col items-center px-4 pt-6 text-center sm:translate-y-0 sm:px-6 sm:pt-20 md:px-10">
        <h1 className="font-(family-name:--font-heading) text-4xl font-bold leading-[1.2] tracking-normal text-white uppercase sm:text-5xl md:text-7xl">
          {SITE_CONFIG.sections.hero.title}
        </h1>
        <p className="mt-4 max-w-xl px-2 text-sm text-gray-300 sm:text-base md:text-lg">
          {SITE_CONFIG.sections.hero.subtitle}
        </p>

        <a
          href={SITE_CONFIG.links.joinMembership}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-gray-200 sm:text-sm"
        >
          {SITE_CONFIG.sections.hero.primaryCtaLabel}
        </a>

        <a
          href={SITE_CONFIG.links.youtubeChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-300 underline decoration-neutral-500 underline-offset-4 transition-colors hover:text-white sm:text-sm"
        >
          {SITE_CONFIG.sections.hero.secondaryLinkLabel}
        </a>
      </div>

      <button
        type="button"
        onClick={() => {
          const target = document.getElementById("stats");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
        className="absolute bottom-8 z-10 cursor-pointer text-gray-300 transition-colors duration-300 hover:text-white"
        aria-label="Scroll down"
      >
        <BiDownArrowAlt className="animate-bounce text-5xl" aria-hidden="true" />
      </button>
    </section>
  );
}
