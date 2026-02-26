type LatestVideo = {
  videoId: string;
  title: string;
  watchUrl: string;
  embedUrl: string;
};

type LatestVideoOptions = {
  channelId?: string;
  fallbackVideoId?: string;
};

const YOUTUBE_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
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

async function findLatestFeedVideo(channelId: string) {
  const rssResponse = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    {
      headers: YOUTUBE_FETCH_HEADERS,
      next: { revalidate: 120 },
    },
  );

  if (!rssResponse.ok) {
    throw new Error("Failed to load YouTube RSS feed.");
  }

  const xml = await rssResponse.text();
  const entries = parseFeedEntries(xml);

  if (entries.length === 0) {
    throw new Error("No recent video found in RSS feed.");
  }

  const latestEntry = entries[0];
  return buildVideoResult(latestEntry.videoId, latestEntry.title || "Latest ThoughtTaken Ride");
}

async function resolveChannelId(channelUrl: string) {
  const handlePath = getHandlePath(channelUrl);

  const pageResponse = await fetch(`https://www.youtube.com${handlePath}`, {
    headers: YOUTUBE_FETCH_HEADERS,
    next: { revalidate: 3600 },
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
  const configuredChannelId = options?.channelId?.trim();
  const fallbackVideoId = options?.fallbackVideoId ?? "dQw4w9WgXcQ";

  try {
    const channelId = configuredChannelId || (await resolveChannelId(channelUrl));
    return await findLatestFeedVideo(channelId);
  } catch {
    return buildVideoResult(fallbackVideoId, "Latest ThoughtTaken Ride");
  }
}
