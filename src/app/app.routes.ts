import { Routes } from '@angular/router';
import { RouteListComponent } from './routes/route-list.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { QrCodeComponent } from './qr-code/qr-code.component';

export const routes: Routes = [
  {
    path: '',
    component: RouteListComponent,
    title: 'Public Route Grader'
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    title: 'Metrics & Search'
  },
  {
    path: 'qr-share',
    component: QrCodeComponent,
    title: 'QR Code'
  }
];