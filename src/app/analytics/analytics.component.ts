import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouteDataService } from '../routes/route-data.service';
import { RouteCardBuilder } from '../routes/route-card.builder';
import { RouteSubmission } from '../routes/route.interface';
import { AnalyticsFilterEngine, AdvancedFilterOptions } from './analytics-filter.engine';
import { AnalyticsViewBuilder, AnalyticsElements } from './analytics-view.builder';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: ''
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dataService = inject(RouteDataService);

  private allSubmissions: RouteSubmission[] = [];
  private filteredSubmissions: RouteSubmission[] = [];
  private isAdvancedOpen = false;
  private nodes!: AnalyticsElements;
  private viewBuilder!: AnalyticsViewBuilder;

  public async ngOnInit(): Promise<void> {
    const host = this.el.nativeElement;
    this.renderer.setStyle(host, 'display', 'block');
    this.renderer.setStyle(host, 'width', '100%');

    // Build the view structural nodes via builder
    this.viewBuilder = new AnalyticsViewBuilder(this.renderer);
    this.nodes = this.viewBuilder.build();
    this.renderer.appendChild(host, this.nodes.container);

    // Wire component toggle listener
    this.nodes.toggleBtn.addEventListener('click', () => this.toggleAdvancedPanel());

    // Wire live typing and toggle events
    const controls = [
      this.nodes.searchInput,
      this.nodes.gymSelect,
      this.nodes.sortBySelect,
      this.nodes.orderSelect,
      this.nodes.gradeSelect,
      this.nodes.ratingSelect,
      this.nodes.statusSelect
    ];
    
    controls.forEach(ctrl => {
      ['input', 'change'].forEach(evt => {
        ctrl.addEventListener(evt, () => this.executePipeline());
      });
    });

    await this.loadDataset();
  }

  public ngOnDestroy(): void {
    if (this.viewBuilder) {
      this.viewBuilder.destroy();
    }
  }

  private async loadDataset(): Promise<void> {
    const raw = await this.dataService.fetchSubmissions();
    this.allSubmissions = raw.filter(sub => 
      sub.routeName && 
      !sub.routeName.toLowerCase().includes('route name?') &&
      sub.timestamp.toLowerCase().trim() !== 'timestamp'
    );

    this.populateGymDropdown();
  }

  private populateGymDropdown(): void {
    const gyms = this.allSubmissions
      .map(sub => (sub.location || '').trim())
      .filter(gym => gym.length > 0);

    Array.from(new Set(gyms))
      .sort((a, b) => a.localeCompare(b))
      .forEach(gymName => {
        const optionEl = this.renderer.createElement('option');
        optionEl.value = gymName;
        optionEl.innerText = gymName;
        this.renderer.appendChild(this.nodes.gymSelect, optionEl);
      });
  }

  private toggleAdvancedPanel(): void {
    this.isAdvancedOpen = !this.isAdvancedOpen;
    this.renderer.setStyle(this.nodes.advancedPanel, 'display', this.isAdvancedOpen ? 'flex' : 'none');
    
    const color = this.isAdvancedOpen ? '#ffb400' : '#ff6600';
    this.nodes.toggleBtn.style.color = color;
    this.nodes.toggleBtn.style.borderColor = color;
  }

  private executePipeline(): void {
    const options: AdvancedFilterOptions = {
      query: this.nodes.searchInput.value,
      sortBy: this.nodes.sortBySelect.value,
      order: this.nodes.orderSelect.value as 'asc' | 'desc',
      grade: this.nodes.gradeSelect.value,
      rating: this.nodes.ratingSelect.value,
      status: this.nodes.statusSelect.value,
      gym: this.nodes.gymSelect.value
    };

    this.filteredSubmissions = AnalyticsFilterEngine.filter(this.allSubmissions, options);
    this.renderFilteredCards();
  }

  private renderFilteredCards(): void {
    this.nodes.resultsGrid.innerHTML = '';

    if (this.nodes.searchInput.value.trim() && this.filteredSubmissions.length === 0) {
      const noResults = this.renderer.createElement('p');
      noResults.innerText = 'No matching route submissions found.';
      this.renderer.setStyle(noResults, 'color', '#888888');
      this.renderer.setStyle(noResults, 'fontStyle', 'italic');
      this.renderer.setStyle(noResults, 'gridColumn', '1 / -1');
      this.renderer.appendChild(this.nodes.resultsGrid, noResults);
      return;
    }

    const cardBuilder = new RouteCardBuilder(this.renderer);
    this.filteredSubmissions.forEach((submission, index) => {
      const card = cardBuilder.build(submission, index);
      this.renderer.appendChild(this.nodes.resultsGrid, card);
    });
  }
}