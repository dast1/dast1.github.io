const WORDS_PER_MINUTE = 230;

export function readingMinutes(markdown: string | undefined): number {
  if (!markdown) return 1;
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return 1;
  const words = text.split(' ').length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
