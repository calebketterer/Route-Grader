import { Renderer2 } from '@angular/core';
import { GRID_LAYOUT_STYLES } from '../routes/route.constants';
import {
  ANALYTICS_CONTAINER_STYLES,
  PROMPT_HEADER_STYLES,
  SEARCH_DECK_STYLES,
  CONTROL_ROW_STYLES,
  ADVANCED_PANEL_STYLES,
  INPUT_CONTROL_STYLES,
  ADVANCED_TOGGLE_STYLES
} from './analytics.constants';

export interface AnalyticsElements {
  container: HTMLElement;
  searchInput: HTMLInputElement;
  gymSelect: HTMLSelectElement;
  toggleBtn: HTMLButtonElement;
  advancedPanel: HTMLElement;
  sortBySelect: HTMLSelectElement;
  orderSelect: HTMLSelectElement;
  gradeSelect: HTMLSelectElement;
  ratingSelect: HTMLSelectElement;
  statusSelect: HTMLSelectElement;
  resultsGrid: HTMLElement;
}

export class AnalyticsViewBuilder {
  private resizeObserver?: ResizeObserver;

  constructor(private renderer: Renderer2) {}

  public build(): AnalyticsElements {
    const container = this.renderer.createElement('div');
    this.applyStyles(container, ANALYTICS_CONTAINER_STYLES);

    // Prompt Header
    const promptHeader = this.renderer.createElement('h2');
    promptHeader.innerText = 'What are you looking for?';
    this.applyStyles(promptHeader, PROMPT_HEADER_STYLES);
    this.renderer.appendChild(container, promptHeader);

    // Dynamic scale-to-fit calculation
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        if (containerWidth <= 0) continue;

        // Reset styling briefly to measure natural full size width safely
        this.renderer.setStyle(promptHeader, 'fontSize', '1.75rem');
        this.renderer.setStyle(promptHeader, 'textAlign', 'left');
        const naturalWidth = promptHeader.scrollWidth;

        // If it doesn't fit, shrink it proportionally and center it
        if (naturalWidth > containerWidth) {
          const ratio = containerWidth / naturalWidth;
          const targetRem = Math.max(1.0, 1.75 * ratio); // Don't let it shrink to microscopic sizes
          this.renderer.setStyle(promptHeader, 'fontSize', `${targetRem}rem`);
          this.renderer.setStyle(promptHeader, 'textAlign', 'center');
        }
      }
    });

    // Observe layout element container width changes
    this.resizeObserver.observe(container);

    // Search Deck Wrap
    const searchDeck = this.renderer.createElement('div');
    this.applyStyles(searchDeck, SEARCH_DECK_STYLES);

    // Row 1: Primary Controls
    const primaryRow = this.renderer.createElement('div');
    this.applyStyles(primaryRow, CONTROL_ROW_STYLES);

    const searchInput = this.renderer.createElement('input') as HTMLInputElement;
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search route name...');
    this.applyStyles(searchInput, { ...INPUT_CONTROL_STYLES, flex: '1', minWidth: '200px' });
    this.renderer.appendChild(primaryRow, searchInput);

    const gymSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(gymSelect, { ...INPUT_CONTROL_STYLES, minWidth: '150px' });
    const defaultGymOpt = this.renderer.createElement('option');
    defaultGymOpt.value = 'all';
    defaultGymOpt.innerText = 'All Gyms';
    this.renderer.appendChild(gymSelect, defaultGymOpt);
    this.renderer.appendChild(primaryRow, gymSelect);

    const toggleBtn = this.renderer.createElement('button') as HTMLButtonElement;
    toggleBtn.innerText = '⚙ Advanced Filters';
    this.applyStyles(toggleBtn, ADVANCED_TOGGLE_STYLES);
    this.renderer.appendChild(primaryRow, toggleBtn);
    this.renderer.appendChild(searchDeck, primaryRow);

    // Row 2: Advanced Panel Container
    const advancedPanel = this.renderer.createElement('div');
    this.applyStyles(advancedPanel, ADVANCED_PANEL_STYLES);

    const sortBySelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(sortBySelect, { ...INPUT_CONTROL_STYLES, minWidth: '160px' });
    [
      { value: 'routeName', text: 'Sort by: Route Name' },
      { value: 'difficulty', text: 'Sort by: Difficulty' },
      { value: 'rating', text: 'Sort by: Rating' },
      { value: 'timestamp', text: 'Sort by: Date Added' }
    ].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(sortBySelect, opt);
    });
    this.renderer.appendChild(advancedPanel, sortBySelect);

    const orderSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(orderSelect, { ...INPUT_CONTROL_STYLES, minWidth: '120px' });
    [{ value: 'asc', text: 'Ascending' }, { value: 'desc', text: 'Descending' }].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(orderSelect, opt);
    });
    this.renderer.appendChild(advancedPanel, orderSelect);

    const gradeSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(gradeSelect, { ...INPUT_CONTROL_STYLES, minWidth: '140px' });
    [{ value: 'all', text: 'All Grades' }, { value: '5.10', text: '5.10' }, { value: '5.11', text: '5.11' }, { value: '5.12', text: '5.12' }].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(gradeSelect, opt);
    });
    this.renderer.appendChild(advancedPanel, gradeSelect);

    const ratingSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(ratingSelect, { ...INPUT_CONTROL_STYLES, minWidth: '140px' });
    [{ value: 'all', text: 'Any Rating' }, { value: '3', text: '★ 3+ Stars' }, { value: '4', text: '★ 4+ Stars' }, { value: '5', text: '★ 5 Stars Only' }].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(ratingSelect, opt);
    });
    this.renderer.appendChild(advancedPanel, ratingSelect);

    const statusSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(statusSelect, { ...INPUT_CONTROL_STYLES, minWidth: '140px' });
    [{ value: 'all', text: 'All Sends' }, { value: 'onsight', text: 'Onsight Only' }, { value: 'sent', text: 'Regular Sends' }].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(statusSelect, opt);
    });
    this.renderer.appendChild(advancedPanel, statusSelect);
    
    this.renderer.appendChild(searchDeck, advancedPanel);
    this.renderer.appendChild(container, searchDeck);

    // Results Layout Grid
    const resultsGrid = this.renderer.createElement('div');
    this.applyStyles(resultsGrid, GRID_LAYOUT_STYLES);
    this.renderer.appendChild(container, resultsGrid);

    return {
      container,
      searchInput,
      gymSelect,
      toggleBtn,
      advancedPanel,
      sortBySelect,
      orderSelect,
      gradeSelect,
      ratingSelect,
      statusSelect,
      resultsGrid
    };
  }

  public destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }
}