import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScenarioStatusEventComponent } from '../list/scenario-status-event.component';
import { ScenarioStatusEventDetailComponent } from '../detail/scenario-status-event-detail.component';
import { ScenarioStatusEventUpdateComponent } from '../update/scenario-status-event-update.component';
import { ScenarioStatusEventRoutingResolveService } from './scenario-status-event-routing-resolve.service';

const scenarioStatusEventRoute: Routes = [
  {
    path: '',
    component: ScenarioStatusEventComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScenarioStatusEventDetailComponent,
    resolve: {
      scenarioStatusEvent: ScenarioStatusEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScenarioStatusEventUpdateComponent,
    resolve: {
      scenarioStatusEvent: ScenarioStatusEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScenarioStatusEventUpdateComponent,
    resolve: {
      scenarioStatusEvent: ScenarioStatusEventRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scenarioStatusEventRoute)],
  exports: [RouterModule],
})
export class ScenarioStatusEventRoutingModule {}
