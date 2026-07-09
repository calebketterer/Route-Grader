import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouteDataService } from '../routes/route-data.service';
import { RouteSubmission } from '../routes/route.interface';
import { AnalyticsFilterEngine, AdvancedFilterOptions } from './analytics-filter.engine';
import { AnalyticsViewBuilder, AnalyticsElements } from './analytics-view.builder';
import { ClusterAggregatorService } from './data-clustering/cluster-aggregator.service';
import { RouteCardRowBuilder, RowClusterElements } from './data-clustering/route-card-row.builder';
import { RouteCardAnimationHelper } from './data-clustering/route-card-animation.helper';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: ''
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dataService = inject(RouteDataService);
  private readonly aggregator = inject(ClusterAggregatorService);

  private allSubmissions: RouteSubmission[] = [];
  private filteredSubmissions: RouteSubmission[] = [];
  private isAdvancedOpen = false;
  private nodes!: AnalyticsElements;
  private viewBuilder!: AnalyticsViewBuilder;
  private gridResizeObserver?: ResizeObserver;
  private currentLayoutColumns = 2;

  public async ngOnInit(): Promise<void> {
    const host = this.el.nativeElement;
    this.renderer.setStyle(host, 'display', 'block');
    this.renderer.setStyle(host, 'width', '100%');

    this.viewBuilder = new AnalyticsViewBuilder(this.renderer);
    this.nodes = this.viewBuilder.build();
    this.renderer.appendChild(host, this.nodes.container);

    this.renderer.setStyle(this.nodes.resultsGrid, 'position', 'relative');

    this.nodes.toggleBtn.addEventListener('click', () => this.toggleAdvancedPanel());

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

    this.gridResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const targetColumns = containerWidth < 920 ? 1 : 2;
        
        if (targetColumns !== this.currentLayoutColumns) {
          this.currentLayoutColumns = targetColumns;
          this.renderer.setStyle(
            this.nodes.resultsGrid, 
            'gridTemplateColumns', 
            targetColumns === 1 ? '1fr' : 'repeat(2, 1fr)'
          );
          this.renderFilteredCards();
        } else {
          // Real-time anchor snapping tracking engine loops here
          const activeHeaders = Array.from(this.nodes.resultsGrid.querySelectorAll('.analytics-route-header-row'));
          activeHeaders.forEach((header: any) => {
            if (header.activeConnectorLine && header.associatedDrawerContainer) {
              RouteCardAnimationHelper.updateLinePosition(
                this.renderer,
                this.nodes.resultsGrid,
                header,
                header.associatedDrawerContainer,
                header.activeConnectorLine
              );
            }
          });
        }
      }
    });
    this.gridResizeObserver.observe(this.nodes.container);

    await this.loadDataset();
  }

  public ngOnDestroy(): void {
    if (this.viewBuilder) {
      this.viewBuilder.destroy();
    }
    if (this.gridResizeObserver) {
      this.gridResizeObserver.disconnect();
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
    this.executePipeline();
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

    const clusteredRoutes = this.aggregator.aggregate(this.filteredSubmissions);
    const rowBuilder = new RouteCardRowBuilder(this.renderer);
    const elementsList: RowClusterElements[] = clusteredRoutes.map((cluster, index) => 
      rowBuilder.build(cluster, index)
    );

    if (this.currentLayoutColumns === 2) {
      for (let i = 0; i < elementsList.length; i += 2) {
        const itemLeft = elementsList[i];
        const itemRight = elementsList[i + 1];

        if (itemLeft) this.renderer.appendChild(this.nodes.resultsGrid, itemLeft.header);
        if (itemRight) this.renderer.appendChild(this.nodes.resultsGrid, itemRight.header);

        if (itemLeft) this.renderer.appendChild(this.nodes.resultsGrid, itemLeft.drawer);
        if (itemRight) this.renderer.appendChild(this.nodes.resultsGrid, itemRight.drawer);
      }
    } else {
      elementsList.forEach(item => {
        this.renderer.appendChild(this.nodes.resultsGrid, item.header);
        this.renderer.appendChild(this.nodes.resultsGrid, item.drawer);
      });
    }
  }
}