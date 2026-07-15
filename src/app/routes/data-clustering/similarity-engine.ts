import { NameNormalizer } from './name-normalizer';

export class SimilarityEngine {
  public static areSimilar(nameA: string, nameB: string): boolean {
    const normA = NameNormalizer.normalize(nameA);
    const normB = NameNormalizer.normalize(nameB);

    if (normA === normB) return true;
    if (!normA || !normB) return false;

    const tokensA = NameNormalizer.tokenize(normA);
    const tokensB = NameNormalizer.tokenize(normB);

    // Single word routes fall back onto Levenshtein distance calculations
    if (tokensA.length <= 1 || tokensB.length <= 1) {
      const distance = this.levenshtein(normA, normB);
      const maxLen = Math.max(normA.length, normB.length);
      if (maxLen <= 4) return distance <= 1; // Tight margin for short names like "Axe" vs "Apex"
      return distance <= 2;
    }

    // Phrase-based comparison using Sorensen-Dice token coefficient
    const score = this.calculateSorensenDice(tokensA, tokensB);
    return score >= 0.65; // Threshold matching limit for complex phrases
  }

  private static calculateSorensenDice(tokensA: string[], tokensB: string[]): number {
    const setB = new Set(tokensB);
    let intersections = 0;

    tokensA.forEach(token => {
      if (setB.has(token)) {
        intersections++;
      }
    });

    return (2 * intersections) / (tokensA.length + tokensB.length);
  }

  private static levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}