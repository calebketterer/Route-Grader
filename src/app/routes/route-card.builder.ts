import { Renderer2 } from '@angular/core';
import { RouteSubmission } from './route.interface';
import { CARD_BASE_STYLES } from './route.constants';

export class RouteCardBuilder {
  constructor(private renderer: Renderer2) {}

  public build(submission: RouteSubmission): HTMLElement {
    const card = this.renderer.createElement('div');
    card.className = 'route-card';
    this.applyStyles(card, CARD_BASE_STYLES);

    // --- ROW 1: Header (Title, Grade, Rating) ---
    const headerRow = this.createHeaderRow(submission);
    this.renderer.appendChild(card, headerRow);

    // --- ROW 2: Status Prefix & Location ---
    const locBlock = this.createLocationBlock(submission);
    this.renderer.appendChild(card, locBlock);

    // --- ROW 3: Optional Additional Comments ---
    if (submission.comments.trim()) {
      const commentBlock = this.createCommentBlock(submission.comments);
      this.renderer.appendChild(card, commentBlock);
    }

    // --- ROW 4: Footer Context Metadata ---
    const footerRow = this.createFooterRow(submission);
    this.renderer.appendChild(card, footerRow);

    return card;
  }

  private createHeaderRow(submission: RouteSubmission): HTMLElement {
    const row = this.renderer.createElement('div');
    this.applyStyles(row, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '0.5rem'
    });

    const titleGroup = this.renderer.createElement('div');
    this.applyStyles(titleGroup, { display: 'flex', alignItems: 'baseline', gap: '0.5rem' });

    const nameSpan = this.renderer.createElement('span');
    nameSpan.innerText = submission.routeName;
    this.applyStyles(nameSpan, {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#e0e0e0',
      fontFamily: '"Times New Roman", Times, serif'
    });

    const diffSpan = this.renderer.createElement('span');
    diffSpan.innerText = `[${this.formatDifficulty(submission.difficulty)}]`;
    this.applyStyles(diffSpan, {
      fontSize: '0.95rem',
      color: '#a239ca',
      fontFamily: 'monospace',
      fontWeight: 'bold'
    });

    this.renderer.appendChild(titleGroup, nameSpan);
    this.renderer.appendChild(titleGroup, diffSpan);

    const ratingSpan = this.renderer.createElement('span');
    ratingSpan.innerText = `★ ${submission.rating}/5`;
    this.applyStyles(ratingSpan, {
      fontSize: '1rem',
      color: '#ffb400',
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      whiteSpace: 'nowrap'
    });

    this.renderer.appendChild(row, titleGroup);
    this.renderer.appendChild(row, ratingSpan);
    return row;
  }

  private createLocationBlock(submission: RouteSubmission): HTMLElement {
    const block = this.renderer.createElement('div');
    this.applyStyles(block, { fontSize: '0.9rem', fontFamily: 'sans-serif', color: '#aaaaaa' });

    const isOnsight = submission.onsightRaw.toLowerCase().trim() === 'yes';
    const prefixSpan = this.renderer.createElement('span');
    prefixSpan.innerText = `${isOnsight ? 'Onsight' : 'Sent'} `;
    this.applyStyles(prefixSpan, {
      fontWeight: 'bold',
      color: isOnsight ? '#ffb400' : '#a239ca'
    });

    const locationText = this.renderer.createText(`at ${submission.location}`);
    this.renderer.appendChild(block, prefixSpan);
    this.renderer.appendChild(block, locationText);
    return block;
  }

  private createCommentBlock(comments: string): HTMLElement {
    const block = this.renderer.createElement('p');
    block.innerText = `"${comments}"`;
    this.applyStyles(block, {
      fontSize: '1rem',
      color: '#888888',
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: 'italic',
      margin: '0',
      lineHeight: '1.3',
      paddingLeft: '0.5rem',
      borderLeft: '1px solid #444444'
    });
    return block;
  }

  private createFooterRow(submission: RouteSubmission): HTMLElement {
    const row = this.renderer.createElement('div');
    this.applyStyles(row, {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#555555',
      fontFamily: 'sans-serif',
      borderTop: '1px solid #2f2f2f',
      paddingTop: '0.4rem',
      marginTop: '0.2rem'
    });

    const authorSpan = this.renderer.createElement('span');
    authorSpan.innerText = `By: ${submission.reviewerName}`;

    const dateSpan = this.renderer.createElement('span');
    dateSpan.innerText = submission.timestamp;

    this.renderer.appendChild(row, authorSpan);
    this.renderer.appendChild(row, dateSpan);
    return row;
  }

  private formatDifficulty(difficulty: string): string {
    let clean = difficulty.trim();
    const match = clean.match(/^5\.(\d+)(.*)$/);
    if (match) {
      const subGradeStr = match[1];
      const suffix = match[2] || '';
      if (subGradeStr === '1') {
        return `5.10${suffix}`;
      } else if (subGradeStr.startsWith('0') && subGradeStr.length > 1) {
        return `5.${parseInt(subGradeStr, 10)}${suffix}`;
      }
    }
    return clean;
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }
}