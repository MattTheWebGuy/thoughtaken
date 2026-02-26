import { SITE_CONFIG } from "../lib/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-900 bg-black px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs uppercase tracking-[0.18em] text-gray-500 md:flex-row md:text-sm">
        <p>{SITE_CONFIG.branding.logoText}</p>
        <p>© {currentYear} {SITE_CONFIG.branding.rightsReservedName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
