import { Renderer2 } from '@angular/core';
import {
  QR_CONTAINER_STYLES,
  QR_HEADER_STYLES,
  QR_SUBTEXT_STYLES,
  QR_IMAGE_WRAPPER_STYLES,
  QR_IMAGE_STYLES,
  QR_ACTION_ROW_STYLES,
  QR_BUTTON_STYLES,
  QR_PRIMARY_YELLOW_BUTTON_STYLES
} from './qr-code.constants';

export interface QrCodeElements {
  container: HTMLElement;
  downloadPdfBtn: HTMLButtonElement;
  googleDocLink: HTMLAnchorElement;
}

export class QrCodeViewBuilder {
  constructor(private renderer: Renderer2) {}

  public build(qrImageUrl: string, docUrl: string): QrCodeElements {
    const container = this.renderer.createElement('div');
    this.applyStyles(container, QR_CONTAINER_STYLES);

    const header = this.renderer.createElement('h2');
    header.innerText = 'Print & Post The Form QR Code';
    this.applyStyles(header, QR_HEADER_STYLES);
    this.renderer.appendChild(container, header);

    const subtext = this.renderer.createElement('p');
    subtext.innerText = 'To place your own QR codes, print the downloadable PDF and simply tuck these tags behind the start hold of a route. Scanning this QR code sends the viewer to the Google Form.';
    this.applyStyles(subtext, QR_SUBTEXT_STYLES);
    this.renderer.appendChild(container, subtext);

    // Creates the dynamic gradient background frame wrapper
    const imageWrapper = this.renderer.createElement('div');
    this.applyStyles(imageWrapper, QR_IMAGE_WRAPPER_STYLES);

    const qrImage = this.renderer.createElement('img') as HTMLImageElement;
    qrImage.setAttribute('src', qrImageUrl);
    qrImage.setAttribute('alt', 'Form QR Code');
    this.applyStyles(qrImage, QR_IMAGE_STYLES);

    // Nest the graphic within the circular gradient view panel
    this.renderer.appendChild(imageWrapper, qrImage);
    this.renderer.appendChild(container, imageWrapper);

    const actionRow = this.renderer.createElement('div');
    this.applyStyles(actionRow, QR_ACTION_ROW_STYLES);

    const downloadPdfBtn = this.renderer.createElement('button') as HTMLButtonElement;
    downloadPdfBtn.innerText = '📥 Download Printable PDF';
    this.applyStyles(downloadPdfBtn, QR_PRIMARY_YELLOW_BUTTON_STYLES);
    this.renderer.appendChild(actionRow, downloadPdfBtn);

    const googleDocLink = this.renderer.createElement('a') as HTMLAnchorElement;
    googleDocLink.innerText = '📄 Google Doc Backup ↗';
    googleDocLink.setAttribute('href', docUrl);
    googleDocLink.setAttribute('target', '_blank');
    googleDocLink.setAttribute('rel', 'noopener noreferrer');
    this.applyStyles(googleDocLink, QR_BUTTON_STYLES);
    this.hookHoverStyles(googleDocLink);

    this.renderer.appendChild(actionRow, googleDocLink);
    this.renderer.appendChild(container, actionRow);

    return {
      container,
      downloadPdfBtn,
      googleDocLink
    };
  }

  private hookHoverStyles(element: HTMLElement): void {
    element.addEventListener('mouseenter', () => {
      this.renderer.setStyle(element, 'backgroundColor', 'rgb(255, 180, 0)');
      this.renderer.setStyle(element, 'color', '#1a1a1a');
    });
    element.addEventListener('mouseleave', () => {
      this.renderer.setStyle(element, 'backgroundColor', 'transparent');
      this.renderer.setStyle(element, 'color', 'rgb(255, 180, 0)');
    });
  }

  private applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    Object.entries(styles).forEach(([property, value]) => {
      this.renderer.setStyle(element, property, value);
    });
  }
}