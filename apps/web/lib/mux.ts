/**
 * Utilities for validating and embedding Mux Video assets via Playback ID.
 */

const MUX_PLAYBACK_ID_RE = /^[a-zA-Z0-9_-]{8,80}$/;

/**
 * Extracts a clean Mux Playback ID from either a raw Playback ID string
 * or common Mux URLs (player.mux.com, stream.mux.com, image.mux.com).
 */
export function extractMuxPlaybackId(rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return '';

  if (MUX_PLAYBACK_ID_RE.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    const firstSegment = url.pathname
      .split('/')
      .filter(Boolean)[0]
      ?.replace(/\.(m3u8|mp4|jpg|jpeg|png|webp|gif)$/i, '');

    if (
      firstSegment &&
      (host.endsWith('mux.com') || host.endsWith('muxed.dev')) &&
      MUX_PLAYBACK_ID_RE.test(firstSegment)
    ) {
      return firstSegment;
    }
  } catch {
    // Non-URL input falls through to regex validation below
  }

  return '';
}

export function isValidMuxPlaybackId(playbackId: string): boolean {
  return MUX_PLAYBACK_ID_RE.test(playbackId.trim());
}

/**
 * Builds the official responsive player.mux.com iframe URL using documented
 * query parameters (`accent-color`, `poster-time`, `metadata-video-title`).
 */
export function buildMuxEmbedUrl(
  playbackId: string,
  options?: {
    title?: string;
    accentColor?: string;
    posterTimeSec?: number;
  }
): string {
  const cleanId = extractMuxPlaybackId(playbackId);
  if (!cleanId) return '';

  const params = new URLSearchParams();
  if (options?.accentColor && /^#[0-9a-fA-F]{3,8}$/.test(options.accentColor.trim())) {
    params.set('accent-color', options.accentColor.trim());
  }
  if (typeof options?.posterTimeSec === 'number' && Number.isFinite(options.posterTimeSec) && options.posterTimeSec >= 0) {
    params.set('poster-time', String(Math.floor(options.posterTimeSec)));
  }
  if (options?.title?.trim()) {
    params.set('metadata-video-title', options.title.trim().slice(0, 120));
  }

  const qs = params.toString();
  return `https://player.mux.com/${encodeURIComponent(cleanId)}${qs ? `?${qs}` : ''}`;
}

export function buildMuxThumbnailUrl(
  playbackId: string,
  options?: { width?: number; timeSec?: number }
): string {
  const cleanId = extractMuxPlaybackId(playbackId);
  if (!cleanId) return '';

  const params = new URLSearchParams();
  if (options?.width && options.width > 0) {
    params.set('width', String(Math.min(1920, Math.round(options.width))));
  }
  params.set('fit_mode', 'smartcrop');
  if (typeof options?.timeSec === 'number' && Number.isFinite(options.timeSec) && options.timeSec >= 0) {
    params.set('time', String(Math.floor(options.timeSec)));
  }
  return `https://image.mux.com/${encodeURIComponent(cleanId)}/thumbnail.jpg?${params.toString()}`;
}

export function parseChaptersText(raw: string): Array<{ time: string; seconds: number; title: string }> {
  const out: Array<{ time: string; seconds: number; title: string }> = [];
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const m = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–|]?\s*(.+)$/);
      if (!m) return;
      const parts = m[1].split(':').map((n) => Number(n));
      let seconds = 0;
      if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      if (Number.isFinite(seconds) && m[2].trim()) {
        out.push({
          time: m[1],
          seconds,
          title: m[2].trim().slice(0, 120),
        });
      }
    });
  return out;
}
