import { Injectable } from '@angular/core';
import { RouteSubmission } from '../../routes/route.interface';
import { SimilarityEngine } from './similarity-engine';
import { NameNormalizer } from './name-normalizer';

export interface RouteCluster {
  leaderName: string;
  location: string;
  avgGrade: string;
  avgRating: number;
  firstReviewDate: string;
  mostRecentReviewDate: string;
  submissions: RouteSubmission[];
}

@Injectable({
  providedIn: 'root'
})
export class ClusterAggregatorService {
  public aggregate(submissions: RouteSubmission[]): RouteCluster[] {
    const clusters: RouteCluster[] = [];

    submissions.forEach(sub => {
      const subGym = (sub.location || '').trim();
      
      let matchedCluster = clusters.find(c => 
        c.location.toLowerCase() === subGym.toLowerCase() &&
        SimilarityEngine.areSimilar(c.leaderName, sub.routeName)
      );

      if (matchedCluster) {
        matchedCluster.submissions.push(sub);
      } else {
        clusters.push({
          leaderName: sub.routeName,
          location: subGym || 'Unknown Gym',
          avgGrade: '',
          avgRating: 0,
          firstReviewDate: '',
          mostRecentReviewDate: '',
          submissions: [sub]
        });
      }
    });

    clusters.forEach(cluster => this.calculateMetrics(cluster));
    return clusters;
  }

  private calculateMetrics(cluster: RouteCluster): void {
    let totalRating = 0;
    let validRatingsCount = 0;
    const timestamps: number[] = [];
    const gradeCounts: { [key: string]: number } = {};

    cluster.submissions.forEach(sub => {
      const r = Number(sub.rating);
      if (!isNaN(r) && r > 0) {
        totalRating += r;
        validRatingsCount++;
      }

      if (sub.difficulty) {
        const d = sub.difficulty.trim();
        gradeCounts[d] = (gradeCounts[d] || 0) + 1;
      }

      const parsedTime = Date.parse(sub.timestamp);
      if (!isNaN(parsedTime)) {
        timestamps.push(parsedTime);
      }
    });

    cluster.avgRating = validRatingsCount > 0 ? Number((totalRating / validRatingsCount).toFixed(1)) : 0;
    cluster.avgGrade = this.getDominantGrade(gradeCounts);
    
    cluster.leaderName = NameNormalizer.formatToReadable(this.resolveLeaderString(cluster.submissions));

    if (timestamps.length > 0) {
      const sortedTimes = [...timestamps].sort((a, b) => a - b);
      cluster.firstReviewDate = new Date(sortedTimes[0]).toLocaleDateString();
      cluster.mostRecentReviewDate = new Date(sortedTimes[sortedTimes.length - 1]).toLocaleDateString();
    } else {
      cluster.firstReviewDate = 'N/A';
      cluster.mostRecentReviewDate = 'N/A';
    }
  }

  private getDominantGrade(counts: { [key: string]: number }): string {
    let dominant = 'N/A';
    let max = 0;
    Object.entries(counts).forEach(([grade, count]) => {
      if (count > max) {
        max = count;
        dominant = grade;
      }
    });
    
    // Explicit safety catch to preserve string structures (e.g. "5.10" stays "5.10")
    return dominant;
  }

  private resolveLeaderString(subs: RouteSubmission[]): string {
    const stringCounts: { [key: string]: number } = {};
    let leader = subs[0].routeName;
    let max = 0;

    subs.forEach(s => {
      const n = (s.routeName || '').trim();
      stringCounts[n] = (stringCounts[n] || 0) + 1;
      if (stringCounts[n] > max) {
        max = stringCounts[n];
        leader = n;
      }
    });
    return leader;
  }
}