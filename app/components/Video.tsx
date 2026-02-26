import { SITE_CONFIG } from "../lib/site-config";
import { getLatestYouTubeVideo } from "../lib/youtube";

export const dynamic = "force-dynamic";

export default async function Video() {
  const latestRide = SITE_CONFIG.sections.latestRide;
  const latestVideo = await getLatestYouTubeVideo(SITE_CONFIG.links.youtubeChannel, {
    channelId: SITE_CONFIG.links.youtubeChannelId,
    fallbackVideoId: latestRide.fallbackVideoId,
    minimumLongformSeconds: latestRide.minimumLongformSeconds,
  });

  return (
    <section
      id="videos"
      className="bg-neutral-950 px-4 py-14 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          {latestRide.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-gray-300 sm:text-base">
          {latestRide.description}
        </p>

        <div className="mt-7 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={latestVideo.embedUrl}
              title={latestVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={SITE_CONFIG.links.subscribe}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-gray-200"
          >
            {latestRide.primaryButtonLabel}
          </a>
          <a
            href={SITE_CONFIG.links.joinMembership}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-700 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-900"
          >
            {latestRide.secondaryButtonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
