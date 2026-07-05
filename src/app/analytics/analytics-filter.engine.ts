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
    const query = options.query.toLowerCase().trim();

    if (!query) {
      return [];
    }

    let matches = submissions.filter(sub => {
      const matchesName = sub.routeName.toLowerCase().includes(query);
      if (!matchesName) return false;

      // Fixed: Strictly read from 'location' property on RouteSubmission
      if (options.gym && options.gym !== 'all') {
        const gymValue = (sub.location || '').toLowerCase().trim();
        if (gymValue !== options.gym.toLowerCase().trim()) return false;
      }

      if (options.grade && options.grade !== 'all') {
        if (sub.difficulty.trim() !== options.grade) return false;
      }

      if (options.rating && options.rating !== 'all') {
        if (Number(sub.rating) < Number(options.rating)) return false;
      }

      if (options.status && options.status !== 'all') {
        const isOnsight = sub.onsightRaw.toLowerCase().trim() === 'yes';
        if (options.status === 'onsight' && !isOnsight) return false;
        if (options.status === 'sent' && isOnsight) return false;
      }

      return true;
    });

    matches.sort((a, b) => {
      const sortBy = options.sortBy;
      const isAsc = options.order === 'asc';
      const valA = a[sortBy as keyof RouteSubmission] || '';
      const valB = b[sortBy as keyof RouteSubmission] || '';

      if (sortBy === 'rating') {
        return isAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
      }

      if (sortBy === 'difficulty') {
        return isAsc 
          ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
          : String(valB).localeCompare(String(valA), undefined, { numeric: true });
      }

      return isAsc 
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return matches;
  }
}