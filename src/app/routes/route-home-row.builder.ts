import { Renderer2 } from '@angular/core';
import { RouteCluster } from '../analytics/data-clustering/cluster-aggregator.service';
import { RouteCardBuilder } from './route-card.builder';
import { RouteCardAnimationHelper } from '../analytics/data-clustering/route-card-animation.helper';

export interface HomeRowClusterElements {
  header: HTMLElement;
  drawer: HTMLElement;
}

export class RouteHomeRowBuilder {
  constructor(private renderer: Renderer2) {}

  public build(cluster: RouteCluster, index: number): HomeRowClusterElements {
    // --- MAIN GOLD PREVIEW HEADER CARD BLOCK ---
    const rowContainer = this.renderer.createElement('div');
    rowContainer.className = 'analytics-route-header-row';
    this.setStyles(rowContainer, {
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem',
      cursor: 'pointer',
      userSelect: 'none',
      background: '#242424',
      borderLeft: '4px solid #ffb400', // Gold highlight border
      borderRadius: '4px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
      transition: 'background 0.2s ease',
      gap: '0.75rem',
      width: '100%',
      minWidth: '0px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: '2'
    });

    rowContainer.addEventListener('mouseenter', () => this.renderer.setStyle(rowContainer, 'background', '#2f2f2f'));
    rowContainer.addEventListener('mouseleave', () => {
      if (rowContainer.getAttribute('data-expanded') !== 'true') {
        this.renderer.setStyle(rowContainer, 'background', '#242424');
      }
    });

    // --- LINE 1: Route Name (White) & Location (Darker Gray) Sans-Serif Stack ---
    const lineOne = this.renderer.createElement('div');
    this.setStyles(lineOne, {
      display: 'block',
      fontSize: '1.15rem',
      fontFamily: 'sans-serif', // Replaced Times New Roman with clean subheader style
      width: '100%',
      overflowWrap: 'break-word'
    });

    const boldName = this.renderer.createElement('strong');
    boldName.innerText = cluster.leaderName;
    this.setStyles(boldName, { color: '#ffffff' }); // Reset title to white
    
    const locationSpan = this.renderer.createElement('span');
    locationSpan.innerText = `, ${cluster.location}`;
    this.setStyles(locationSpan, {
      fontSize: '0.95rem',
      fontWeight: 'normal',
      color: '#777777' // Darker gray matching footer layouts
    });

    this.renderer.appendChild(lineOne, boldName);
    this.renderer.appendChild(lineOne, locationSpan);
    this.renderer.appendChild(rowContainer, lineOne);

    // --- LINE 2: Metrics Sentence Block ---
    const lineTwo = this.renderer.createElement('div');
    this.setStyles(lineTwo, {
      fontSize: '0.95rem',
      fontFamily: 'sans-serif',
      color: '#aaaaaa',
      width: '100%',
      lineHeight: '1.4'
    });

    const sortedTimeline = [...cluster.submissions].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const rawFirstDate = sortedTimeline[0]?.timestamp || 'N/A';
    const firstReviewDate = rawFirstDate.includes(' ') ? rawFirstDate.split(' ')[0] : rawFirstDate;

    const cleanGrade = cluster.avgGrade === '5.1' ? '5.10' : cluster.avgGrade;
    const cleanRating = cluster.avgRating > 0 ? `${cluster.avgRating}/5` : 'N/A';

    const segment1 = this.renderer.createText('Graded as ');
    const boldGrade = this.renderer.createElement('strong');
    boldGrade.innerText = cleanGrade;
    this.setStyles(boldGrade, { color: '#a239ca', fontFamily: 'monospace' });

    const segment2 = this.renderer.createText(' and ');
    
    const goldStarSpan = this.renderer.createElement('span');
    goldStarSpan.innerText = '★ ';
    this.setStyles(goldStarSpan, { color: '#ffb400' });

    const boldRating = this.renderer.createElement('strong');
    boldRating.innerText = cleanRating;
    this.setStyles(boldRating, { color: '#ffb400' });

    const segment3 = this.renderer.createText(' from ');
    const boldCount = this.renderer.createElement('strong');
    boldCount.innerText = `${cluster.submissions.length}`;
    
    const segment4 = this.renderer.createText(` review(s) since `);
    const boldDate = this.renderer.createElement('strong');
    boldDate.innerText = firstReviewDate;

    this.renderer.appendChild(lineTwo, segment1);
    this.renderer.appendChild(lineTwo, boldGrade);
    this.renderer.appendChild(lineTwo, segment2);
    this.renderer.appendChild(lineTwo, goldStarSpan);
    this.renderer.appendChild(lineTwo, boldRating);
    this.renderer.appendChild(lineTwo, segment3);
    this.renderer.appendChild(lineTwo, boldCount);
    this.renderer.appendChild(lineTwo, segment4);
    this.renderer.appendChild(lineTwo, boldDate);
    this.renderer.appendChild(rowContainer, lineTwo);

    // --- LINE 3: Most Recent Active Submission Comment ---
    const sortedSubsDesc = [...cluster.submissions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const validCommentSub = sortedSubsDesc.find(s => s.comments && s.comments.trim().length > 0);

    if (validCommentSub) {
      const commentBlock = this.renderer.createElement('p');
      commentBlock.innerText = `"${validCommentSub.comments.trim()}"`;
      this.setStyles(commentBlock, {
        fontSize: '0.95rem',
        color: '#888888',
        fontFamily: 'sans-serif', // Replaced Times New Roman
        fontStyle: 'italic',
        margin: '0',
        lineHeight: '1.3',
        paddingLeft: '0.5rem',
        borderLeft: '1px solid #444444',
        overflowWrap: 'break-word'
      });
      this.renderer.appendChild(rowContainer, commentBlock);
    }

    // --- LINE 4: Metadata Footer (Latest Comment Details) ---
    const targetMetaSub = validCommentSub || sortedSubsDesc[0] || cluster.submissions[0];
    if (targetMetaSub) {
      const footerRow = this.renderer.createElement('div');
      this.setStyles(footerRow, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.75rem',
        color: '#555555',
        fontFamily: 'sans-serif',
        borderTop: '1px solid #2f2f2f',
        paddingTop: '0.4rem',
        marginTop: '0.2rem',
        width: '100%'
      });

      const authorSpan = this.renderer.createElement('span');
      authorSpan.innerText = `Latest comment by: ${targetMetaSub.reviewerName}`;
      
      const dateSpan = this.renderer.createElement('span');
      dateSpan.innerText = targetMetaSub.timestamp;
      this.setStyles(dateSpan, {
        textAlign: 'right',
        whiteSpace: 'nowrap'
      });

      this.renderer.appendChild(footerRow, authorSpan);
      this.renderer.appendChild(footerRow, dateSpan);
      this.renderer.appendChild(rowContainer, footerRow);
    }

    // --- EXPANDED NESTED DETAILS DRAWER PANEL ---
    const drawerPanel = this.renderer.createElement('div');
    this.setStyles(drawerPanel, {
      display: 'none',
      gridColumn: '1 / -1',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
      padding: '1.25rem',
      border: '1px solid #2f2f2f',
      borderTop: '2px solid #ffb400', // Gold highlight top border
      borderRadius: '6px',
      background: '#141414',
      width: '100%',
      boxSizing: 'border-box',
      marginTop: '0.75rem',
      marginBottom: '0.75rem',
      position: 'relative',
      zIndex: '2'
    });

    const cardBuilder = new RouteCardBuilder(this.renderer);
    cluster.submissions.forEach((sub, subIdx) => {
      const feedbackCard = cardBuilder.build(sub, subIdx);
      this.setStyles(feedbackCard, { margin: '0', width: '100%', maxWidth: '100%' });
      this.renderer.appendChild(drawerPanel, feedbackCard);
    });

    const collapseRow = () => {
      if (rowContainer.getAttribute('data-expanded') !== 'true') return;
      rowContainer.setAttribute('data-expanded', 'false');
      this.renderer.setStyle(rowContainer, 'background', '#242424');
      
      RouteCardAnimationHelper.collapseDrawer(drawerPanel);
      RouteCardAnimationHelper.removeLine(rowContainer);
    };

    (rowContainer as any).collapseSelfRow = collapseRow;

    rowContainer.addEventListener('click', () => {
      const isCurrentlyOpen = rowContainer.getAttribute('data-expanded') === 'true';
      const parentContainer = rowContainer.parentElement;

      if (!isCurrentlyOpen) {
        if (parentContainer) {
          const gridColumns = window.getComputedStyle(parentContainer).gridTemplateColumns.split(' ').length;
          if (gridColumns > 1) {
            const allHeaders = Array.from(parentContainer.querySelectorAll('.analytics-route-header-row'));
            const currentPosIndex = allHeaders.indexOf(rowContainer);
            
            const isLineStart = currentPosIndex % 2 === 0;
            const siblingIndex = isLineStart ? currentPosIndex + 1 : currentPosIndex - 1;
            const targetSibling = allHeaders[siblingIndex] as any;

            if (targetSibling && typeof targetSibling.collapseSelfRow === 'function') {
              targetSibling.collapseSelfRow();
            }
          }
        }

        rowContainer.setAttribute('data-expanded', 'true');
        this.renderer.setStyle(rowContainer, 'background', '#2f2f2f');
        
        RouteCardAnimationHelper.expandDrawer(drawerPanel, () => {
          if (parentContainer) {
            RouteCardAnimationHelper.drawConnectingLine(this.renderer, parentContainer, rowContainer, drawerPanel);
          }
        });
      } else {
        collapseRow();
      }
    });

    return { header: rowContainer, drawer: drawerPanel };
  }

  private setStyles(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([prop, val]) => this.renderer.setStyle(el, prop, val));
  }
}