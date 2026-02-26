type LatestVideo = {
  videoId: string;
  title: string;
  watchUrl: string;
  embedUrl: string;
};

type LatestVideoOptions = {
  channelId?: string;
  fallbackVideoId?: string;
  minimumLongformSeconds?: number;
};

const YOUTUBE_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

function logYoutubeDebug(message: string, details?: Record<string, unknown>) {
  if (details) {
    console.info("[youtube-latest]", message, details);
    return;
  }

  console.info("[youtube-latest]", message);
}

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
    headers: YOUTUBE_FETCH_HEADERS,
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
  logYoutubeDebug("Fetching channel RSS feed", {
    channelId,
    minimumLongformSeconds,
  });

  const rssResponse = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    {
      headers: YOUTUBE_FETCH_HEADERS,
      next: { revalidate: 900 },
    },
  );

  if (!rssResponse.ok) {
    throw new Error("Failed to load YouTube RSS feed.");
  }

  const xml = await rssResponse.text();
  const entries = parseFeedEntries(xml);

  logYoutubeDebug("Parsed feed entries", {
    channelId,
    entryCount: entries.length,
    firstEntry: entries[0]
      ? {
          videoId: entries[0].videoId,
          title: entries[0].title,
        }
      : null,
  });

  if (entries.length === 0) {
    throw new Error("No recent video found in RSS feed.");
  }

  const latestFeedEntry = entries[0];

  for (const entry of entries.slice(0, 12)) {
    const details = await getVideoPageDetails(entry.videoId);
    if (!details) {
      logYoutubeDebug("Skipping entry: could not load watch-page details", {
        videoId: entry.videoId,
      });
      continue;
    }

    logYoutubeDebug("Evaluating entry", {
      videoId: entry.videoId,
      isShort: details.isShort,
      lengthSeconds: details.lengthSeconds,
    });

    if (!details.isShort && details.lengthSeconds >= minimumLongformSeconds) {
      logYoutubeDebug("Selected longform entry", {
        videoId: entry.videoId,
        title: entry.title,
      });
      return buildVideoResult(entry.videoId, entry.title || "Latest ThoughtTaken Ride");
    }
  }

  if (latestFeedEntry) {
    logYoutubeDebug("No qualifying longform found, using latest feed entry", {
      videoId: latestFeedEntry.videoId,
      title: latestFeedEntry.title,
    });

    return buildVideoResult(
      latestFeedEntry.videoId,
      latestFeedEntry.title || "Latest ThoughtTaken Ride",
    );
  }

  throw new Error("No recent longform (non-Short) video found.");
}

async function resolveChannelId(channelUrl: string) {
  const handlePath = getHandlePath(channelUrl);
  logYoutubeDebug("Resolving channel ID from handle page", {
    channelUrl,
    handlePath,
  });

  const pageResponse = await fetch(`https://www.youtube.com${handlePath}`, {
    headers: YOUTUBE_FETCH_HEADERS,
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

  logYoutubeDebug("Resolved channel ID from handle", {
    channelId: channelMatch[1],
  });

  return channelMatch[1];
}

export async function getLatestYouTubeVideo(
  channelUrl: string,
  options?: LatestVideoOptions,
): Promise<LatestVideo> {
  const configuredChannelId = options?.channelId?.trim();
  const fallbackVideoId = options?.fallbackVideoId ?? "dQw4w9WgXcQ";
  const minimumLongformSeconds = options?.minimumLongformSeconds ?? 180;

  try {
    logYoutubeDebug("Starting latest-video resolution", {
      channelUrl,
      configuredChannelId: configuredChannelId || null,
      fallbackVideoId,
      minimumLongformSeconds,
    });

    const channelId = configuredChannelId || (await resolveChannelId(channelUrl));
    const selected = await findLatestLongformVideo(channelId, minimumLongformSeconds);

    logYoutubeDebug("Latest-video resolution success", {
      selectedVideoId: selected.videoId,
      selectedTitle: selected.title,
    });

    return selected;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logYoutubeDebug("Falling back to fallback video", {
      fallbackVideoId,
      reason,
    });

    return buildVideoResult(fallbackVideoId, "Latest ThoughtTaken Ride");
  }
}
