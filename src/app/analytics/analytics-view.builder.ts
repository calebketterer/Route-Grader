import { Renderer2 } from '@angular/core';
import { GRID_LAYOUT_STYLES } from '../routes/route.constants';
import {
  ANALYTICS_CONTAINER_STYLES,
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
  constructor(private renderer: Renderer2) {}

  public build(): AnalyticsElements {
    const container = this.renderer.createElement('div');
    this.applyStyles(container, ANALYTICS_CONTAINER_STYLES);

    // Search Deck Wrap Container
    const searchDeck = this.renderer.createElement('div');
    this.applyStyles(searchDeck, SEARCH_DECK_STYLES);

    // Row 1: Primary Controls (Just Search Bar and Advanced Toggle Button)
    const primaryRow = this.renderer.createElement('div');
    this.applyStyles(primaryRow, CONTROL_ROW_STYLES);

    const searchInput = this.renderer.createElement('input') as HTMLInputElement;
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search route name...');
    this.applyStyles(searchInput, { ...INPUT_CONTROL_STYLES, flex: '1', minWidth: '200px' });
    this.renderer.appendChild(primaryRow, searchInput);

    const toggleBtn = this.renderer.createElement('button') as HTMLButtonElement;
    toggleBtn.innerText = '⚙ Filters';
    this.applyStyles(toggleBtn, ADVANCED_TOGGLE_STYLES);
    this.renderer.appendChild(primaryRow, toggleBtn);
    this.renderer.appendChild(searchDeck, primaryRow);

    // Row 2: Advanced Panel Container (Gym Selector & Sorting Mechanisms)
    const advancedPanel = this.renderer.createElement('div');
    this.applyStyles(advancedPanel, ADVANCED_PANEL_STYLES);

    const gymSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(gymSelect, { ...INPUT_CONTROL_STYLES, minWidth: '150px' });
    const defaultGymOpt = this.renderer.createElement('option');
    defaultGymOpt.value = 'all';
    defaultGymOpt.innerText = 'All Gyms';
    this.renderer.appendChild(gymSelect, defaultGymOpt);
    this.renderer.appendChild(advancedPanel, gymSelect);

    const sortBySelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(sortBySelect, { ...INPUT_CONTROL_STYLES, minWidth: '160px' });
    [
      { value: 'timestamp', text: 'Sort by: Date Added' },
      { value: 'routeName', text: 'Sort by: Route Name' },
      { value: 'difficulty', text: 'Sort by: Difficulty' },
      { value: 'rating', text: 'Sort by: Rating' }
    ].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(sortBySelect, opt);
    });
    this.renderer.appendChild(advancedPanel, sortBySelect);

    const orderSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(orderSelect, { ...INPUT_CONTROL_STYLES, minWidth: '120px' });
    [{ value: 'desc', text: 'Descending' }, { value: 'asc', text: 'Ascending' }].forEach(o => {
      const opt = this.renderer.createElement('option');
      opt.value = o.value; opt.innerText = o.text;
      this.renderer.appendChild(orderSelect, opt);
    });
    this.renderer.appendChild(advancedPanel, orderSelect);

    // Re-added legacy items to ensure AnalyticsComponent compiles safely before deletion
    const gradeSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(gradeSelect, { display: 'none' });

    const ratingSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(ratingSelect, { display: 'none' });

    const statusSelect = this.renderer.createElement('select') as HTMLSelectElement;
    this.applyStyles(statusSelect, { display: 'none' });
    
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

  public destroy(): void {}

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }
}