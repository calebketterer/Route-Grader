import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderBuilder } from './header.builder';

@Component({
  selector: 'app-header',
  standalone: true,
  template: ''
})
export class AppHeaderComponent implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.ensureAnimationKeyframes();

    const builder = new HeaderBuilder(this.renderer, this.router);
    const headerNode = builder.build((title, subtitle) => this.setupResponsiveLayout(title, subtitle));

    this.renderer.appendChild(this.el.nativeElement, headerNode);
  }

  private setupResponsiveLayout(title: HTMLElement, subtitle: HTMLElement): void {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    const handleScreenChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        this.renderer.setStyle(title, 'fontSize', '2.5rem');
        this.renderer.setStyle(title, 'letterSpacing', '0.05rem');
        this.renderer.setStyle(subtitle, 'fontSize', '1.05rem');
      } else {
        this.renderer.setStyle(title, 'fontSize', '3.5rem');
        this.renderer.setStyle(title, 'letterSpacing', '0.1rem');
        this.renderer.setStyle(subtitle, 'fontSize', '1.25rem');
      }
    };

    mediaQuery.addEventListener('change', handleScreenChange);
    handleScreenChange(mediaQuery);
  }

  private ensureAnimationKeyframes(): void {
    const styleId = 'app-header-keyframes';
    if (!document.getElementById(styleId)) {
      const styleEl = this.renderer.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      this.renderer.appendChild(document.head, styleEl);
    }
  }
}