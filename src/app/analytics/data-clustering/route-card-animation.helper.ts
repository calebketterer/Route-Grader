import { Renderer2 } from '@angular/core';

export class RouteCardAnimationHelper {
  /**
   * Spawns or pulls the active connecting tracking line from the center base 
   * of the clicked row header down to meet the edge boundary of the drawer tray.
   */
  public static drawConnectingLine(
    renderer: Renderer2,
    parent: HTMLElement,
    header: HTMLElement,
    drawer: HTMLElement
  ): HTMLElement {
    this.removeLine(header);

    const line = renderer.createElement('div');
    renderer.addClass(line, 'route-connector-line');
    
    renderer.setStyle(line, 'position', 'absolute');
    renderer.setStyle(line, 'width', '2px');
    renderer.setStyle(line, 'background', '#ff6600');
    renderer.setStyle(line, 'zIndex', '1');
    renderer.setStyle(line, 'pointerEvents', 'none');
    renderer.setStyle(line, 'transformOrigin', 'top center');

    // Attach tracking metadata links directly onto the element nodes
    (header as any).activeConnectorLine = line;
    (header as any).associatedDrawerContainer = drawer;

    // Execute absolute positioning updates
    this.updateLinePosition(renderer, parent, header, drawer, line);

    renderer.appendChild(parent, line);

    line.animate(
      [
        { transform: 'scaleY(0)', opacity: 0 },
        { transform: 'scaleY(1)', opacity: 1 }
      ],
      { duration: 200, easing: 'ease-out', fill: 'forwards' }
    );

    return line;
  }

  /**
   * Real-time structural update layout calculator engine.
   */
  public static updateLinePosition(
    renderer: Renderer2,
    parent: HTMLElement,
    header: HTMLElement,
    drawer: HTMLElement,
    line: HTMLElement
  ): void {
    const parentRect = parent.getBoundingClientRect();
    const headerRect = header.getBoundingClientRect();
    const drawerRect = drawer.getBoundingClientRect();

    const lineLeft = headerRect.left - parentRect.left + (headerRect.width / 2) - 1;
    const lineTop = headerRect.bottom - parentRect.top;
    const lineHeight = drawerRect.top - headerRect.bottom + 2;

    renderer.setStyle(line, 'left', `${lineLeft}px`);
    renderer.setStyle(line, 'top', `${lineTop}px`);
    renderer.setStyle(line, 'height', `${lineHeight}px`);
  }

  /**
   * Safely purges the structural tracking line attachment reference.
   */
  public static removeLine(header: HTMLElement): void {
    const activeLine = (header as any).activeConnectorLine;
    if (activeLine && activeLine.parentElement) {
      activeLine.animate(
        [
          { transform: 'scaleY(1)', opacity: 1 },
          { transform: 'scaleY(0)', opacity: 0 }
        ],
        { duration: 150, easing: 'ease-in' }
      ).onfinish = () => {
        if (activeLine.parentElement) {
          activeLine.parentElement.removeChild(activeLine);
        }
      };
      (header as any).activeConnectorLine = null;
      (header as any).associatedDrawerContainer = null;
    }
  }

  /**
   * Runs an accordion expansion sequence on the child card node.
   */
  public static expandDrawer(drawer: HTMLElement, onComplete?: () => void): void {
    drawer.style.display = 'grid';
    const targetHeight = drawer.scrollHeight;

    drawer.animate(
      [
        { height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px', overflow: 'hidden' },
        { height: `${targetHeight}px`, opacity: 1, paddingTop: '1.25rem', paddingBottom: '1.25rem', overflow: 'visible' }
      ],
      { duration: 220, easing: 'cubic-bezier(0.25, 1, 0.5, 1)', fill: 'forwards' }
    ).onfinish = () => {
      drawer.style.height = 'auto';
      if (onComplete) onComplete();
    };
  }

  /**
   * Collapses the element back to zero heights before hiding visibility tracks completely.
   */
  public static collapseDrawer(drawer: HTMLElement): void {
    const currentHeight = drawer.offsetHeight;

    drawer.animate(
      [
        { height: `${currentHeight}px`, opacity: 1, overflow: 'hidden' },
        { height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px', overflow: 'hidden' }
      ],
      { duration: 180, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }
    ).onfinish = () => {
      drawer.style.display = 'none';
    };
  }
}