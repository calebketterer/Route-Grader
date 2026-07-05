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
    
    this.ensureResponsiveAndAnimationStyles();

    const cardBuilder = new RouteCardBuilder(this.renderer);
    submissions.forEach((submission, index) => {
      const card = cardBuilder.build(submission, index);
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

  private ensureResponsiveAndAnimationStyles(): void {
    const styleId = 'app-route-list-grid-responsive';
    if (!document.getElementById(styleId)) {
      const styleEl = this.renderer.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes card-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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