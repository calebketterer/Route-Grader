import { Routes } from '@angular/router';
import { RouteListComponent } from './routes/route-list.component';
import { AnalyticsComponent } from './analytics/analytics.component';

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
  }
];