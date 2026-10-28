import { Routes } from '@angular/router';
import { CurrentAffairsPage } from '@pages/current-affairs/current-affairs.page';
import { CurrentAffairsDayPage } from '@pages/current-affairs/current-affairs-day.page';

export const CurrentAffairsRoutes: Routes = [
  {
    path: '',
    component: CurrentAffairsPage
  },
  {
    path: ':date',
    component: CurrentAffairsDayPage
  }
];
