import { Component, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeService } from './qr-code.service';
import { QrCodeViewBuilder } from './qr-code-view.builder';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: []
})
export class QrCodeComponent implements OnInit, OnDestroy {
  private viewBuilder!: QrCodeViewBuilder;
  private unlisteners: Array<() => void> = [];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private qrService: QrCodeService
  ) {}

  public ngOnInit(): void {
    this.viewBuilder = new QrCodeViewBuilder(this.renderer);
    const qrUrl = this.qrService.getQrCodeUrl();
    const docUrl = this.qrService.getGoogleDocUrl();
    
    const elements = this.viewBuilder.build(qrUrl, docUrl);

    this.unlisteners.push(
      this.renderer.listen(elements.downloadPdfBtn, 'click', () => this.handlePdfDownload())
    );

    this.renderer.appendChild(this.elementRef.nativeElement, elements.container);
  }

  private handlePdfDownload(): void {
    this.qrService.downloadPdfFile();
  }

  public ngOnDestroy(): void {
    this.unlisteners.forEach(remove => remove());
  }
}