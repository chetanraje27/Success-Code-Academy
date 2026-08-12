export interface ParsedVideoInfo {
  type: "video" | "iframe";
  embedUrl: string;
  isInstagram: boolean;
  isYoutube: boolean;
}

/**
 * Transforms any raw video input link (YouTube watch, YouTube shorts, Instagram reel/post, or direct MP4 link)
 * into a standardized format ready for rendering inside standard HTML5 <video> or <iframe> embeds.
 */
export function parseVideoUrl(rawUrl: string): ParsedVideoInfo {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { type: "iframe", embedUrl: "", isInstagram: false, isYoutube: false };
  }

  const trimmed = rawUrl.trim();

  // 1. Direct MP4 or video files
  if (trimmed.endsWith(".mp4") || trimmed.endsWith(".webm") || trimmed.endsWith(".mov")) {
    return {
      type: "video",
      embedUrl: trimmed,
      isInstagram: false,
      isYoutube: false,
    };
  }

  // 2. YouTube URLs
  // Handles:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  const youtubeMatch =
    trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      type: "iframe",
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      isInstagram: false,
      isYoutube: true,
    };
  }

  // 3. Instagram Reels / Posts
  // Handles:
  // - https://www.instagram.com/reel/REEL_ID/
  // - https://www.instagram.com/p/POST_ID/
  // - https://www.instagram.com/reels/REEL_ID/
  const instagramMatch = trimmed.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i);

  if (instagramMatch && instagramMatch[1]) {
    const postId = instagramMatch[1];
    return {
      type: "iframe",
      embedUrl: `https://www.instagram.com/reel/${postId}/embed`,
      isInstagram: true,
      isYoutube: false,
    };
  }

  // Fallback for pre-formatted embed URLs or other iframe URLs
  return {
    type: "iframe",
    embedUrl: trimmed,
    isInstagram: trimmed.includes("instagram.com"),
    isYoutube: trimmed.includes("youtube.com") || trimmed.includes("youtu.be"),
  };
}
