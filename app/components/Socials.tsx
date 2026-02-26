import type { IconType } from "react-icons";
import {
  BiLogoInstagram,
  BiLogoTiktok,
  BiLogoYoutube,
} from "react-icons/bi";
import { SITE_CONFIG } from "../lib/site-config";

const iconByPlatform: Record<string, IconType> = {
  TikTok: BiLogoTiktok,
  YouTube: BiLogoYoutube,
  Instagram: BiLogoInstagram,
};

const activeSocials = SITE_CONFIG.socials.filter((social) => social.enabled);
const featuredSocial = activeSocials.find((social) => social.featured);
const orderedSocials = featuredSocial
  ? [
      ...activeSocials.filter((social) => social.platform !== featuredSocial.platform).slice(0, 1),
      featuredSocial,
      ...activeSocials.filter((social) => social.platform !== featuredSocial.platform).slice(1),
    ]
  : activeSocials;

export default function Socials() {
  return (
    <section
      id="socials"
      className="bg-neutral-950 px-4 py-14 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          {SITE_CONFIG.sections.community.title}
        </h2>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 md:grid-cols-3">
          {orderedSocials.map((social, index) => {
            const Icon = iconByPlatform[social.platform] ?? BiLogoYoutube;
            const youtubeCard = social.featured;
            const orderClass =
              index === 1 ? "md:order-2" : index === 0 ? "md:order-1" : "md:order-3";

            return (
            <a
              key={social.platform}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex min-w-0 items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-white transition duration-300 ${orderClass} ${
                youtubeCard
                  ? "border-white/70 bg-white/10 hover:bg-white/20"
                  : "border-neutral-800 bg-black/40 hover:border-neutral-600"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="text-2xl sm:text-3xl" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-[0.12em] sm:text-sm md:text-base">
                  {social.platform}
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gray-300 sm:ml-auto sm:text-xs md:text-sm">
                {social.handle}
              </span>
            </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
