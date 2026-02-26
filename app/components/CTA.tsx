import { SITE_CONFIG } from "../lib/site-config";

export default function CTA() {
  const section = SITE_CONFIG.sections.finalCta;

  return (
    <section
      id="cta"
      className="border-y border-neutral-800 bg-black px-4 py-8 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <h2 className="font-(family-name:--font-heading) text-2xl font-extrabold text-white uppercase sm:text-3xl md:text-4xl">
          {section.title}
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={SITE_CONFIG.links.joinMembership}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-gray-200 sm:text-sm"
          >
            {section.primaryButtonLabel}
          </a>
          <a
            href={SITE_CONFIG.links.store}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-700 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-neutral-900 sm:text-sm"
          >
            {section.secondaryButtonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
