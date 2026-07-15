import { Renderer2 } from '@angular/core';
import { RouteCluster } from './cluster-aggregator.service';
import { RouteCardBuilder } from '../route-card.builder';
import { RouteCardAnimationHelper } from '../ui-shared/route-card-animation.helper';

export interface RowClusterElements {
  header: HTMLElement;
  drawer: HTMLElement;
}

export class RouteCardRowBuilder {
  constructor(private renderer: Renderer2) {}

  public build(cluster: RouteCluster, index: number): RowClusterElements {
    // --- MAIN HEADER CONTAINER BLOCK ---
    const rowContainer = this.renderer.createElement('div');
    this.renderer.addClass(rowContainer, 'analytics-route-header-row');
    this.setStyles(rowContainer, {
      display: 'flex',
      flexDirection: 'column',
      padding: '0.85rem 1.25rem',
      cursor: 'pointer',
      userSelect: 'none',
      background: index % 2 === 0 ? '#1f1f1f' : '#1a1a1a',
      border: '1px solid #2f2f2f',
      borderLeft: '4px solid #2f2f2f',
      borderRadius: '6px',
      transition: 'background 0.2s ease, border-left-color 0.2s ease',
      gap: '0.65rem',
      width: '100%',
      minWidth: '0px', // Prevents default flex item grid blowout
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: '2'
    });

    rowContainer.addEventListener('mouseenter', () => this.renderer.setStyle(rowContainer, 'background', '#2a2a2a'));
    rowContainer.addEventListener('mouseleave', () => {
      if (rowContainer.getAttribute('data-expanded') !== 'true') {
        this.renderer.setStyle(rowContainer, 'background', index % 2 === 0 ? '#1f1f1f' : '#1a1a1a');
      }
    });

    // --- LINE 1: Route Name, Location | Drop Arrow ---
    const lineOne = this.renderer.createElement('div');
    this.setStyles(lineOne, {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
      minWidth: '0px'
    });

    const topLeftGroup = this.renderer.createElement('div');
    this.setStyles(topLeftGroup, { 
      flex: '1', 
      minWidth: '0px',
      overflow: 'hidden', 
      textOverflow: 'ellipsis', 
      whiteSpace: 'nowrap' 
    });
    topLeftGroup.innerHTML = `<span style="font-weight: bold; color: #ffb400; font-size: 1.05rem;">${cluster.leaderName}</span><span style="color: #888888; font-size: 0.9rem;">, ${cluster.location}</span>`;
    this.renderer.appendChild(lineOne, topLeftGroup);

    const toggleArrow = this.renderer.createElement('span');
    toggleArrow.innerText = '▼';
    this.setStyles(toggleArrow, { 
      color: '#ff6600', 
      transition: 'transform 0.2s ease', 
      fontSize: '0.85rem',
      display: 'inline-flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      flexShrink: '0'
    });
    this.renderer.appendChild(lineOne, toggleArrow);
    this.renderer.appendChild(rowContainer, lineOne);

    // --- LINE 2: Combined Natural Language Summary Track ---
    const lineTwo = this.renderer.createElement('div');
    this.setStyles(lineTwo, {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: '#cccccc',
      width: '100%',
      minWidth: '0px' // Overrides flex auto minimum constraints entirely
    });

    const cleanGrade = cluster.avgGrade === '5.1' ? '5.10' : cluster.avgGrade;
    const ratingString = cluster.avgRating > 0 ? `★ <strong>${cluster.avgRating}/5</strong>` : '<span style="color: #888888;">★</span> <strong>N/A</strong>';
    const totalReviews = cluster.submissions.length;

    const summarySpan = this.renderer.createElement('span');
    summarySpan.innerHTML = `Graded as <strong>${cleanGrade}</strong> and ${ratingString} from <strong>${totalReviews}</strong> reviews since <strong>${cluster.firstReviewDate}</strong>`;
    this.setStyles(summarySpan, {
      width: '100%',
      overflowWrap: 'break-word', // Safely wraps text to next line on mobile widths
      wordBreak: 'break-word'
    });
    
    this.renderer.appendChild(lineTwo, summarySpan);
    this.renderer.appendChild(rowContainer, lineTwo);

    // --- EXPANDED DETAILS PANEL ---
    const drawerPanel = this.renderer.createElement('div');
    this.setStyles(drawerPanel, {
      display: 'none',
      gridColumn: '1 / -1', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1rem',
      padding: '1.25rem',
      border: '1px solid #2f2f2f',
      borderTop: '2px solid #ff6600', 
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
      
      this.renderer.setStyle(toggleArrow, 'transform', 'rotate(0deg)');
      this.renderer.setStyle(rowContainer, 'background', index % 2 === 0 ? '#1f1f1f' : '#1a1a1a');
      this.renderer.setStyle(rowContainer, 'borderLeftColor', '#2f2f2f');
      
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
        this.renderer.setStyle(toggleArrow, 'transform', 'rotate(180deg)');
        this.renderer.setStyle(rowContainer, 'background', '#2a2a2a');
        this.renderer.setStyle(rowContainer, 'borderLeftColor', '#ff6600');
        
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