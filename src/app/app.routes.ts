import { Routes } from '@angular/router';
import { RouteListComponent } from './routes/route-list.component';
import { QrCodeComponent } from './qr-code/qr-code.component';

export const routes: Routes = [
  {
    path: '',
    component: RouteListComponent,
    title: 'Public Route Grader'
  },
  {
    path: 'qr-share',
    component: QrCodeComponent,
    title: 'QR Code'
  }
];