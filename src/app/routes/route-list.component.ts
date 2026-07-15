import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { RouteDataService } from './route-data.service';
import { RouteSubmission } from './route.interface';
import { RouteViewBuilder, RouteViewElements } from './ui-shared/route-view.builder';
import { RouteFilterEngine } from './ui-shared/route-filter.engine';
import { ClusterAggregatorService, RouteCluster } from './data-clustering/cluster-aggregator.service';
import { RouteHomeRowBuilder, HomeRowClusterElements } from './route-home-row.builder';
import { RouteCardAnimationHelper } from './ui-shared/route-card-animation.helper';

// Adjust this single configuration variable to globally modify layout changes
const RESPONSIVE_BREAKPOINT = 700;

@Component({
  selector: 'app-route-list',
  standalone: true,
  template: ''
})
export class RouteListComponent implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly dataService = inject(RouteDataService);
  private readonly aggregator = inject(ClusterAggregatorService);

  private allSubmissions: RouteSubmission[] = [];
  private filteredSubmissions: RouteSubmission[] = [];
  private isAdvancedOpen = false;
  private viewBuilder!: RouteViewBuilder;
  private nodes!: RouteViewElements;
  private gridResizeObserver?: ResizeObserver;
  private currentLayoutColumns = 2;

  public async ngOnInit(): Promise<void> {
    const host = this.el.nativeElement;

    this.viewBuilder = new RouteViewBuilder(this.renderer);
    this.nodes = this.viewBuilder.build();
    this.renderer.appendChild(host, this.nodes.container);

    this.renderer.setStyle(this.nodes.resultsGrid, 'position', 'relative');
    this.renderer.setStyle(this.nodes.resultsGrid, 'marginTop', '1.5rem');

    this.nodes.toggleBtn.addEventListener('click', () => this.toggleAdvancedPanel());

    const controls = [
      this.nodes.searchInput,
      this.nodes.gymSelect,
      this.nodes.sortBySelect,
      this.nodes.orderSelect
    ];
    
    controls.forEach(ctrl => {
      ['input', 'change'].forEach(evt => {
        ctrl.addEventListener(evt, () => this.executePipeline());
      });
    });

    this.ensureResponsiveAndAnimationStyles();

    this.gridResizeObserver = new ResizeObserver(() => {
      const windowWidth = window.innerWidth;
      const targetColumns = windowWidth < RESPONSIVE_BREAKPOINT ? 1 : 2;

      if (targetColumns !== this.currentLayoutColumns) {
        this.currentLayoutColumns = targetColumns;
        this.renderer.setStyle(
          this.nodes.resultsGrid, 
          'gridTemplateColumns', 
          targetColumns === 1 ? '1fr' : 'repeat(2, 1fr)'
        );
      }

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
    const options = {
      query: this.nodes.searchInput.value,
      sortBy: this.nodes.sortBySelect.value,
      order: this.nodes.orderSelect.value as 'asc' | 'desc',
      grade: 'all',
      rating: 'all',
      status: 'all',
      gym: this.nodes.gymSelect.value
    };
    this.filteredSubmissions = RouteFilterEngine.filter(this.allSubmissions, options);

    this.renderFilteredCards();
  }

  private sortClustersByNewestSubmission(clusters: RouteCluster[]): RouteCluster[] {
    return clusters.sort((a, b) => {
      const getNewestTime = (c: RouteCluster) => {
        const times = c.submissions.map(s => {
          const parsed = Date.parse(s.timestamp);
          return isNaN(parsed) ? 0 : parsed;
        });
        return times.length > 0 ? Math.max(...times) : 0;
      };
      return getNewestTime(b) - getNewestTime(a);
    });
  }

  private renderFilteredCards(): void {
    this.nodes.resultsGrid.innerHTML = '';

    const windowWidth = window.innerWidth;
    this.currentLayoutColumns = windowWidth < RESPONSIVE_BREAKPOINT ? 1 : 2;

    this.renderer.setStyle(
      this.nodes.resultsGrid,
      'gridTemplateColumns',
      this.currentLayoutColumns === 1 ? '1fr' : 'repeat(2, 1fr)'
    );

    if (this.nodes.searchInput.value.trim() && this.filteredSubmissions.length === 0) {
      const noResults = this.renderer.createElement('p');
      noResults.innerText = 'No matching route submissions found.';
      this.renderer.setStyle(noResults, 'color', '#888888');
      this.renderer.setStyle(noResults, 'fontStyle', 'italic');
      this.renderer.setStyle(noResults, 'gridColumn', '1 / -1');
      this.renderer.appendChild(this.nodes.resultsGrid, noResults);
      return;
    }

    let clusteredRoutes = this.aggregator.aggregate(this.filteredSubmissions);
    
    if (this.nodes.sortBySelect.value === 'timestamp' && this.nodes.orderSelect.value === 'desc') {
      clusteredRoutes = this.sortClustersByNewestSubmission(clusteredRoutes);
    }

    const rowBuilder = new RouteHomeRowBuilder(this.renderer);
    const elementsList: HomeRowClusterElements[] = clusteredRoutes.map((cluster, index) => 
      rowBuilder.build(cluster, index)
    );

    elementsList.forEach((item, index) => {
      const delay = Math.min(index * 0.05, 0.8);
      this.renderer.setStyle(item.header, 'animation', `card-fade-in 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s both`);
    });

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

  private ensureResponsiveAndAnimationStyles(): void {
    const styleId = 'app-route-list-grid-responsive';
    if (!document.getElementById(styleId)) {
      const styleEl = this.renderer.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes card-fade-in {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: ${RESPONSIVE_BREAKPOINT}px) {
          .route-grid-container { grid-template-columns: 1fr !important; }
          .analytics-route-header-row { width: 100% !important; }
          .toggle-btn-text { display: none !important; }
        }
      `;
      this.renderer.appendChild(document.head, styleEl);
    }
  }
}