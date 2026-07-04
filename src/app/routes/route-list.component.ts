import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { RouteDataService } from './route-data.service';
import { RouteCardBuilder } from './route-card.builder';
import { GRID_CONTAINER_STYLES, GRID_LAYOUT_STYLES } from './route.constants';

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
    this.applyStyles(container, GRID_CONTAINER_STYLES);

    const rawSubmissions = await this.dataService.fetchSubmissions();
    const submissions = rawSubmissions.filter(sub => 
      sub.routeName && 
      !sub.routeName.toLowerCase().includes('route name?') &&
      sub.timestamp.toLowerCase().trim() !== 'timestamp'
    );

    if (submissions.length === 0) {
      const loading = this.renderer.createElement('p');
      loading.innerText = 'Loading route records...';
      this.applyStyles(loading, { color: '#888888', fontFamily: 'monospace', textAlign: 'center' });
      this.renderer.appendChild(container, loading);
      this.renderer.appendChild(host, container);
      return;
    }

    const grid = this.renderer.createElement('div');
    grid.className = 'route-grid-container';
    this.applyStyles(grid, GRID_LAYOUT_STYLES);
    
    this.ensureResponsiveStyles();

    const cardBuilder = new RouteCardBuilder(this.renderer);
    submissions.forEach(submission => {
      const card = cardBuilder.build(submission);
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
          .route-grid-container { 
            grid-template-columns: 1fr !important; 
          }
          .route-card { 
            width: 100% !important; 
          }
        }
      `;
      this.renderer.appendChild(document.head, styleEl);
    }
  }
}