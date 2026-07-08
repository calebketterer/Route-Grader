import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  private readonly qrAssetPath = 'qr-tag.png';
  private readonly pdfAssetPath = 'route-grader-printout.pdf';
  private readonly googleDocUrl = 'https://docs.google.com/document/d/1ccKjx6WzA3WCxdWfdG6h-1TwOioZkB2kmYaM8j4nxAw/edit?usp=sharing';

  public getQrCodeUrl(): string {
    return this.qrAssetPath;
  }

  public getPdfUrl(): string {
    return this.pdfAssetPath;
  }

  public getGoogleDocUrl(): string {
    return this.googleDocUrl;
  }

  public downloadPdfFile(): void {
    const link = document.createElement('a');
    link.href = this.pdfAssetPath;
    link.download = 'route-grader-printout.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}