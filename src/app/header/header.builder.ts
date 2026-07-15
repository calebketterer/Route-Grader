import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import {
  HEADER_CONTAINER_STYLES,
  SUBTITLE_CONTAINER_STYLES,
  BUTTON_DECK_STYLES,
  UNIFIED_BUTTON_STYLES
} from './header.constants';

export class HeaderBuilder {
  constructor(
    private renderer: Renderer2,
    private router: Router
  ) {}

  public build(setupResponsive: (title: HTMLElement, subtitle: HTMLElement) => void): HTMLElement {
    const header = this.renderer.createElement('header');
    this.applyStyles(header, HEADER_CONTAINER_STYLES);
    header.style.animation = 'fade-in 10s cubic-bezier(0.23, 1, 0.32, 1) both';

    // Title
    const h1 = this.renderer.createElement('h1');
    h1.innerText = 'Public Route Grader';
    this.applyStyles(h1, {
      fontFamily: '"Times New Roman", Times, serif',
      fontWeight: 'normal',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
      color: '#a239ca',
      margin: '0',
      textAlign: 'center',
      cursor: 'pointer'
    });
    h1.addEventListener('click', () => this.router.navigate(['/']));

    // Subtitle Container Block
    const subContainer = this.renderer.createElement('div');
    this.applyStyles(subContainer, SUBTITLE_CONTAINER_STYLES);

    const p = this.renderer.createElement('p');
    p.innerText = 'Brought to you by C. Kett.';
    this.applyStyles(p, {
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: 'italic',
      fontSize: '1.25rem',
      color: '#888888',
      margin: '0',
      textAlign: 'center',
      letterSpacing: '0.05rem'
    });

    // Buttons
    const buttonDeck = this.renderer.createElement('div');
    this.applyStyles(buttonDeck, BUTTON_DECK_STYLES);

    const surveyLink = this.createSurveyButton();
    const qrButton = this.createQrButton();

    this.renderer.appendChild(buttonDeck, surveyLink);
    this.renderer.appendChild(buttonDeck, qrButton);

    setupResponsive(h1, p);

    this.renderer.appendChild(subContainer, p);
    this.renderer.appendChild(subContainer, buttonDeck);
    
    this.renderer.appendChild(header, h1);
    this.renderer.appendChild(header, subContainer);

    return header;
  }

  private createSurveyButton(): HTMLElement {
    const link = this.renderer.createElement('a');
    link.innerText = 'Submit Route Feedback ↗';
    link.setAttribute('href', 'https://forms.gle/2zr1GgqyTHfC2Qys7');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    
    this.applyStyles(link, {
      ...UNIFIED_BUTTON_STYLES,
      color: '#34a853',
      backgroundColor: 'transparent',
      border: '1px solid #34a853'
    });

    link.addEventListener('mouseenter', () => {
      this.renderer.setStyle(link, 'backgroundColor', '#34a853');
      this.renderer.setStyle(link, 'color', '#1a1a1a');
    });
    link.addEventListener('mouseleave', () => {
      this.renderer.setStyle(link, 'backgroundColor', 'transparent');
      this.renderer.setStyle(link, 'color', '#34a853');
    });

    return link;
  }

  private createQrButton(): HTMLElement {
    const button = this.renderer.createElement('button');
    button.innerText = 'QR Code';

    this.applyStyles(button, {
      ...UNIFIED_BUTTON_STYLES,
      color: 'rgb(255, 180, 0)',
      backgroundColor: 'transparent',
      border: '1px solid rgb(255, 180, 0)'
    });

    button.addEventListener('mouseenter', () => {
      this.renderer.setStyle(button, 'backgroundColor', 'rgb(255, 180, 0)');
      this.renderer.setStyle(button, 'color', '#1a1a1a');
    });
    button.addEventListener('mouseleave', () => {
      this.renderer.setStyle(button, 'backgroundColor', 'transparent');
      this.renderer.setStyle(button, 'color', 'rgb(255, 180, 0)');
    });

    button.addEventListener('click', () => this.router.navigate(['/qr-share']));

    return button;
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }
}