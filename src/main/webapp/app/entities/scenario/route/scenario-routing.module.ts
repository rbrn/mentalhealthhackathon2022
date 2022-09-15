import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScenarioComponent } from '../list/scenario.component';
import { ScenarioDetailComponent } from '../detail/scenario-detail.component';
import { ScenarioUpdateComponent } from '../update/scenario-update.component';
import { ScenarioRoutingResolveService } from './scenario-routing-resolve.service';

const scenarioRoute: Routes = [
  {
    path: '',
    component: ScenarioComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScenarioDetailComponent,
    resolve: {
      scenario: ScenarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScenarioUpdateComponent,
    resolve: {
      scenario: ScenarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScenarioUpdateComponent,
    resolve: {
      scenario: ScenarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scenarioRoute)],
  exports: [RouterModule],
})
export class ScenarioRoutingModule {}
