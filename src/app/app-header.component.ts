import { Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: ''
})
export class AppHeaderComponent implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit(): void {
    const host = this.el.nativeElement;

    // Create container
    const header = this.renderer.createElement('header');
    this.applyStyles(header, {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      userSelect: 'none',
      gap: '0.5rem'
    });

    header.style.animation = 'fade-in 10s cubic-bezier(0.23, 1, 0.32, 1) both';
    this.ensureAnimationKeyframes();

    // Create Title
    const h1 = this.renderer.createElement('h1');
    const titleText = this.renderer.createText('Public Route Grader');
    this.renderer.appendChild(h1, titleText);
    this.applyStyles(h1, {
      fontFamily: '"Times New Roman", Times, serif',
      fontWeight: 'normal',
      textTransform: 'uppercase',
      letterSpacing: '0.1rem',
      color: '#a239ca',
      margin: '0',
      textAlign: 'center'
    });

    // Create Subtitle Container block
    const subContainer = this.renderer.createElement('div');
    this.applyStyles(subContainer, {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.4rem',
      marginTop: '0.25rem'
    });

    const p = this.renderer.createElement('p');
    const subtitleText = this.renderer.createText('Brought to you by C. Kett.');
    this.renderer.appendChild(p, subtitleText);
    this.applyStyles(p, {
      fontFamily: '"Times New Roman", Times, serif',
      fontStyle: 'italic',
      fontSize: '1.25rem',
      color: '#888888',
      margin: '0',
      textAlign: 'center',
      letterSpacing: '0.05rem'
    });

    // Survey Call to Action Link
    const surveyLink = this.renderer.createElement('a');
    surveyLink.innerText = 'Submit New Route Feedback ↗';
    surveyLink.setAttribute('href', 'https://forms.gle/2zr1GgqyTHfC2Qys7');
    surveyLink.setAttribute('target', '_blank');
    surveyLink.setAttribute('rel', 'noopener noreferrer');
    this.applyStyles(surveyLink, {
      fontFamily: 'sans-serif',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      color: '#00ffcc',
      textDecoration: 'none',
      border: '1px solid #00ffcc',
      borderRadius: '4px',
      padding: '0.35rem 0.75rem',
      marginTop: '0.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    });

    // Add CSS hover classes natively to the survey action link
    surveyLink.addEventListener('mouseenter', () => {
      this.renderer.setStyle(surveyLink, 'backgroundColor', '#00ffcc');
      this.renderer.setStyle(surveyLink, 'color', '#1a1a1a');
    });
    surveyLink.addEventListener('mouseleave', () => {
      this.renderer.setStyle(surveyLink, 'backgroundColor', 'transparent');
      this.renderer.setStyle(surveyLink, 'color', '#00ffcc');
    });

    this.setupResponsiveLayout(h1, p);

    this.renderer.appendChild(subContainer, p);
    this.renderer.appendChild(subContainer, surveyLink);
    
    this.renderer.appendChild(header, h1);
    this.renderer.appendChild(header, subContainer);
    this.renderer.appendChild(host, header);
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
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