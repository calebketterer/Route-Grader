import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { RouteDataService } from './route-data.service';
import { RouteSubmission } from './route.interface';

@Component({
  selector: 'app-route-list',
  standalone: true,
  template: ''
})
export class RouteListComponent implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dataService = inject(RouteDataService);

  public async ngOnInit(): Promise<void> {
    const host = this.el.nativeElement;
    const container = this.renderer.createElement('div');
    
    this.applyStyles(container, {
      width: '100%',
      maxWidth: '1200px',
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      boxSizing: 'border-box'
    });

    const rawSubmissions = await this.dataService.fetchSubmissions();

    const submissions = rawSubmissions.filter(sub => 
      sub.routeName && 
      !sub.routeName.toLowerCase().includes('route name?') &&
      sub.timestamp.toLowerCase().trim() !== 'timestamp'
    );

    if (submissions.length === 0) {
      const loading = this.renderer.createElement('p');
      loading.innerText = 'Loading route records...';
      this.applyStyles(loading, {
        color: '#888888',
        fontFamily: 'monospace',
        textAlign: 'center'
      });
      this.renderer.appendChild(container, loading);
      this.renderer.appendChild(host, container);
      return;
    }

    const grid = this.renderer.createElement('div');
    this.applyStyles(grid, {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(48%, 1fr))',
      gap: '1.5rem',
      width: '100%'
    });

    this.ensureResponsiveStyles();

    submissions.forEach(submission => {
      const card = this.renderer.createElement('div');
      card.className = 'route-card';
      this.applyStyles(card, {
        backgroundColor: '#242424',
        borderLeft: '4px solid #a239ca',
        borderRadius: '4px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)'
      });

      // --- ROW 1: Route Name, Difficulty, Quality ---
      const headerRow = this.renderer.createElement('div');
      this.applyStyles(headerRow, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '0.5rem'
      });

      const titleGroup = this.renderer.createElement('div');
      this.applyStyles(titleGroup, {
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.5rem'
      });

      const nameSpan = this.renderer.createElement('span');
      nameSpan.innerText = submission.routeName;
      this.applyStyles(nameSpan, {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#e0e0e0',
        fontFamily: '"Times New Roman", Times, serif'
      });

      // Strict YDS Decimal Normalizer
      let displayDifficulty = submission.difficulty.trim();
      const match = displayDifficulty.match(/^5\.(\d+)(.*)$/);
      if (match) {
        const subGradeStr = match[1];
        const suffix = match[2] || '';
        
        if (subGradeStr === '1') {
          // Explicitly convert raw 5.1 input to 5.10
          displayDifficulty = `5.10${suffix}`;
        } else if (subGradeStr.startsWith('0') && subGradeStr.length > 1) {
          // Catch and repair broken padding artifacts like 5.08 back to 5.8
          const cleanNum = parseInt(subGradeStr, 10);
          displayDifficulty = `5.${cleanNum}${suffix}`;
        }
      }

      const diffSpan = this.renderer.createElement('span');
      diffSpan.innerText = `[${displayDifficulty}]`;
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

      this.renderer.appendChild(headerRow, titleGroup);
      this.renderer.appendChild(headerRow, ratingSpan);
      this.renderer.appendChild(card, headerRow);

      // --- ROW 2: Send Status Prefix & Location Description ---
      const isOnsight = submission.onsightRaw.toLowerCase().trim() === 'yes';
      const prefixText = isOnsight ? 'Onsight' : 'Sent';

      const locBlock = this.renderer.createElement('div');
      this.applyStyles(locBlock, {
        fontSize: '0.9rem',
        fontFamily: 'sans-serif',
        color: '#aaaaaa'
      });

      const prefixSpan = this.renderer.createElement('span');
      prefixSpan.innerText = `${prefixText} `;
      this.applyStyles(prefixSpan, {
        fontWeight: 'bold',
        color: isOnsight ? '#ffb400' : '#a239ca'
      });

      const locationText = this.renderer.createText(`at ${submission.location}`);

      this.renderer.appendChild(locBlock, prefixSpan);
      this.renderer.appendChild(locBlock, locationText);
      this.renderer.appendChild(card, locBlock);

      // --- ROW 3: Optional Additional Comments Review Text ---
      if (submission.comments.trim()) {
        const commentBlock = this.renderer.createElement('p');
        commentBlock.innerText = `"${submission.comments}"`;
        this.applyStyles(commentBlock, {
          fontSize: '1rem',
          color: '#888888',
          fontFamily: '"Times New Roman", Times, serif',
          fontStyle: 'italic',
          margin: '0',
          lineHeight: '1.3',
          paddingLeft: '0.5rem',
          borderLeft: '1px solid #444444'
        });
        this.renderer.appendChild(card, commentBlock);
      }

      // --- ROW 4: Footer Context Metadata ---
      const footerRow = this.renderer.createElement('div');
      this.applyStyles(footerRow, {
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

      this.renderer.appendChild(footerRow, authorSpan);
      this.renderer.appendChild(footerRow, dateSpan);
      this.renderer.appendChild(card, footerRow);

      this.renderer.appendChild(grid, card);
    });

    this.renderer.appendChild(container, grid);
    this.renderer.appendChild(host, container);
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }

  private ensureResponsiveStyles(): void {
    const styleId = 'app-route-list-grid-responsive';
    if (!document.getElementById(styleId)) {
      const styleEl = this.renderer.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @media (max-width: 768px) {
          .route-card { width: 100% !important; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `;
      this.renderer.appendChild(document.head, styleEl);
    }
  }
}