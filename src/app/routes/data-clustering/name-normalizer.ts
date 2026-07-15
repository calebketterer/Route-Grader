export class NameNormalizer {
  private static readonly STOP_WORDS = new Set([
    'a', 'an', 'the', 'in', 'for', 'my', 'of', 'on', 'with', 'at', 'by', 'to', 'and', 'or', 'is'
  ]);

  public static normalize(name: string): string {
    return (name || '')
      .toLowerCase()
      .replace(/['’"?.!,;:()\-]/g, '') // Strips all trailing or structural punctuation
      .replace(/\s+/g, ' ')            // Collapses double spaces
      .trim();
  }

  public static tokenize(normalizedName: string): string[] {
    return normalizedName
      .split(' ')
      .filter(token => token.length > 0 && !this.STOP_WORDS.has(token));
  }

  public static formatToReadable(rawName: string): string {
    const cleaned = (rawName || '').trim().replace(/\s+/g, ' ');
    if (!cleaned) return 'Unknown Route';

    return cleaned
      .split(' ')
      .map(word => {
        if (word.length === 0) return '';
        // Special case: preserve v-grades lowercase/uppercase cleanly (e.g. V4)
        if (/^[vV]\d+/.test(word)) {
          return 'V' + word.substring(1);
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}