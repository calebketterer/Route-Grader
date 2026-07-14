import { RouteSubmission } from '../routes/route.interface';

export interface AdvancedFilterOptions {
  query: string;
  sortBy: string;
  order: 'asc' | 'desc';
  grade: string;
  rating: string;
  status: string;
  gym: string;
}

export class AnalyticsFilterEngine {
  public static filter(submissions: RouteSubmission[], options: AdvancedFilterOptions): RouteSubmission[] {
    const query = (options.query || '').toLowerCase().trim();

    // Map through dataset regardless of whether text query is present
    let matches = submissions.filter(sub => {
      // If text query exists, evaluate it. Otherwise, pass automatically.
      if (query) {
        const routeNameLower = (sub.routeName || '').toLowerCase();
        const matchesName = routeNameLower.includes(query);
        if (!matchesName) return false;
      }

      // Strictly evaluate selected gym drop-down parameters
      if (options.gym && options.gym !== 'all') {
        const gymValue = (sub.location || '').toLowerCase().trim();
        if (gymValue !== options.gym.toLowerCase().trim()) return false;
      }

      if (options.grade && options.grade !== 'all') {
        if ((sub.difficulty || '').trim() !== options.grade) return false;
      }

      if (options.rating && options.rating !== 'all') {
        if (Number(sub.rating || 0) < Number(options.rating)) return false;
      }

      if (options.status && options.status !== 'all') {
        const isOnsight = (sub.onsightRaw || '').toLowerCase().trim() === 'yes';
        if (options.status === 'onsight' && !isOnsight) return false;
        if (options.status === 'sent' && isOnsight) return false;
      }

      return true;
    });

    // Execute dataset ordering logic
    matches.sort((a, b) => {
      const sortBy = options.sortBy;
      const isAsc = options.order === 'asc';

      // Explicit property lookups to prevent structural index bugs
      let valA: any = '';
      let valB: any = '';

      if (sortBy === 'timestamp') {
        valA = a.timestamp || '';
        valB = b.timestamp || '';
        const timeA = Date.parse(valA);
        const timeB = Date.parse(valB);
        if (!isNaN(timeA) && !isNaN(timeB)) {
          return isAsc ? timeA - timeB : timeB - timeA;
        }
      } else if (sortBy === 'routeName') {
        valA = a.routeName || '';
        valB = b.routeName || '';
      } else if (sortBy === 'rating') {
        valA = Number(a.rating || 0);
        valB = Number(b.rating || 0);
        return isAsc ? valA - valB : valB - valA;
      } else if (sortBy === 'difficulty') {
        valA = String(a.difficulty || '');
        valB = String(b.difficulty || '');
        return isAsc 
          ? valA.localeCompare(valB, undefined, { numeric: true })
          : valB.localeCompare(valA, undefined, { numeric: true });
      } else {
        // Fallback catch-all for custom keys
        valA = (a as any)[sortBy] || '';
        valB = (b as any)[sortBy] || '';
      }

      return isAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return matches;
  }
}