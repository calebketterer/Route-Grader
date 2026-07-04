import { Injectable } from '@angular/core';
import { RouteSubmission } from './route.interface';

@Injectable({
  providedIn: 'root'
})
export class RouteDataService {
  private readonly csvUrl = 'https://docs.google.com/spreadsheets/d/1s7O-NEDDutcK11RTDDiRj2-rlDC5z92nc4v-_ucGDmM/export?format=csv';

  public async fetchSubmissions(): Promise<RouteSubmission[]> {
    try {
      const response = await fetch(this.csvUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const csvText = await response.text();
      return this.parseAndSortCsv(csvText);
    } catch (error) {
      console.error('Failed to fetch route data:', error);
      return [];
    }
  }

  private parseAndSortCsv(text: string): RouteSubmission[] {
    const lines = text.split('\n').map(line => this.splitCsvLine(line.trim()));
    if (lines.length < 2) return [];

    const dataRows = lines.slice(1);

    const mappedData: RouteSubmission[] = dataRows
      .filter(row => row.length >= 2 && row[1] !== '')
      .map(row => {
        return {
          timestamp: row[0] || '',
          routeName: row[1] || 'Unknown Route',
          location: row[2] || 'Unknown Location',
          difficulty: row[3] || 'N/A',
          rating: row[4] || '0',
          onsightRaw: row[5] || '',
          comments: row[6] || '',
          reviewerName: row[7]?.trim() ? row[7].trim() : 'Anon'
        };
      });

    return mappedData.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      
      return timeB - timeA;
    });
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  }
}