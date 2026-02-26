type LatestVideo = {
  videoId: string;
  title: string;
  watchUrl: string;
  embedUrl: string;
};

type LatestVideoOptions = {
  fallbackVideoId?: string;
  minimumLongformSeconds?: number;
};

function getHandlePath(channelUrl: string) {
  try {
    const url = new URL(channelUrl);
    return url.pathname || "/@thoughtaken";
  } catch {
    return "/@thoughtaken";
  }
}

function buildVideoResult(videoId: string, title: string): LatestVideo {
  return {
    videoId,
    title,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
  };
}

function decodeXmlEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function parseFeedEntries(xml: string) {
  const entries = Array.from(
    xml.matchAll(
      /<entry>[\s\S]*?<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<\/entry>/g,
    ),
  );

  return entries.map((entry) => ({
    videoId: entry[1],
    title: decodeXmlEntities(entry[2]),
  }));
}

async function getVideoPageDetails(videoId: string) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    return null;
  }

  const html = await response.text();
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
  const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);

  const canonicalUrl = canonicalMatch?.[1] ?? "";
  const lengthSeconds = lengthMatch?.[1] ? Number(lengthMatch[1]) : 0;

  return {
    canonicalUrl,
    lengthSeconds,
    isShort: canonicalUrl.includes("/shorts/"),
  };
}

async function findLatestLongformVideo(channelId: string, minimumLongformSeconds: number) {
  const rssResponse = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    { next: { revalidate: 900 } },
  );

  if (!rssResponse.ok) {
    throw new Error("Failed to load YouTube RSS feed.");
  }

  const xml = await rssResponse.text();
  const entries = parseFeedEntries(xml);

  if (entries.length === 0) {
    throw new Error("No recent video found in RSS feed.");
  }

  for (const entry of entries.slice(0, 12)) {
    const details = await getVideoPageDetails(entry.videoId);
    if (!details) continue;

    if (!details.isShort && details.lengthSeconds >= minimumLongformSeconds) {
      return buildVideoResult(entry.videoId, entry.title || "Latest ThoughtTaken Ride");
    }
  }

  throw new Error("No recent longform (non-Short) video found.");
}

async function resolveChannelId(channelUrl: string) {
  const handlePath = getHandlePath(channelUrl);
  const pageResponse = await fetch(`https://www.youtube.com${handlePath}`, {
    next: { revalidate: 900 },
  });

  if (!pageResponse.ok) {
    throw new Error("Failed to load YouTube channel page.");
  }

  const html = await pageResponse.text();
  const channelMatch =
    html.match(/"channelId":"(UC[a-zA-Z0-9_-]{22})"/) ||
    html.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/);

  if (!channelMatch?.[1]) {
    throw new Error("Unable to resolve channel ID from handle.");
  }

  return channelMatch[1];
}

export async function getLatestYouTubeVideo(
  channelUrl: string,
  options?: LatestVideoOptions,
): Promise<LatestVideo> {
  const fallbackVideoId = options?.fallbackVideoId ?? "dQw4w9WgXcQ";
  const minimumLongformSeconds = options?.minimumLongformSeconds ?? 180;

  try {
    const channelId = await resolveChannelId(channelUrl);
    return await findLatestLongformVideo(channelId, minimumLongformSeconds);
  } catch {
    return buildVideoResult(fallbackVideoId, "Latest ThoughtTaken Ride");
  }
}
