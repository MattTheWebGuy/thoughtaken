import Image from "next/image";
import { SITE_CONFIG } from "../lib/site-config";

export default function About() {
  return (
    <section
      id="about"
      className="bg-neutral-950 px-4 py-14 sm:px-6 md:px-20"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative min-h-80 overflow-hidden rounded-2xl border border-neutral-800 sm:min-h-96 md:min-h-[30rem]">
          <Image
            src={SITE_CONFIG.images.about}
            alt="Matthew from ThoughtTaken"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center text-gray-300">
          <h2 className="font-(family-name:--font-heading) text-2xl font-extrabold tracking-[0.08em] text-white uppercase sm:text-3xl md:text-4xl">
            {SITE_CONFIG.sections.about.title}
          </h2>
          <p className="mt-4 text-base font-semibold text-white sm:text-lg">
            {SITE_CONFIG.sections.about.headline}
          </p>
          <p className="mt-2 text-sm leading-7 sm:text-base md:text-lg">
            {SITE_CONFIG.sections.about.description}
          </p>
          <a
            href={SITE_CONFIG.links.subscribe}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex w-fit rounded-full border border-white/60 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/20 sm:text-sm"
          >
            {SITE_CONFIG.sections.about.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
