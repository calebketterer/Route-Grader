import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { ANALYTICS_CONTAINER_STYLES } from './analytics.constants';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: ''
})
export class AnalyticsComponent implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit(): void {
    const host = this.el.nativeElement;
    const container = this.renderer.createElement('div');
    this.applyStyles(container, ANALYTICS_CONTAINER_STYLES);

    // Title Shell for Sorting Controls & Charts
    const title = this.renderer.createElement('h2');
    title.innerText = 'Analytics & Search Matrix';
    this.applyStyles(title, {
      fontFamily: '"Times New Roman", Times, serif',
      color: '#ff6600',
      borderBottom: '1px solid #2f2f2f',
      paddingBottom: '0.5rem',
      margin: '0'
    });

    const placeholderText = this.renderer.createElement('p');
    placeholderText.innerText = 'Sorting engines and analytical data graphs will render here.';
    this.applyStyles(placeholderText, { color: '#888888', fontStyle: 'italic' });

    this.renderer.appendChild(container, title);
    this.renderer.appendChild(container, placeholderText);
    this.renderer.appendChild(host, container);
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }
}