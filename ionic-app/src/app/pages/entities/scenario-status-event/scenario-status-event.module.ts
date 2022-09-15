import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { ScenarioStatusEventPage } from './scenario-status-event';
import { ScenarioStatusEventUpdatePage } from './scenario-status-event-update';
import { ScenarioStatusEvent, ScenarioStatusEventService, ScenarioStatusEventDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ScenarioStatusEventResolve implements Resolve<ScenarioStatusEvent> {
  constructor(private service: ScenarioStatusEventService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScenarioStatusEvent> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ScenarioStatusEvent>) => response.ok),
        map((scenarioStatusEvent: HttpResponse<ScenarioStatusEvent>) => scenarioStatusEvent.body)
      );
    }
    return of(new ScenarioStatusEvent());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ScenarioStatusEventPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScenarioStatusEventUpdatePage,
    resolve: {
      data: ScenarioStatusEventResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScenarioStatusEventDetailPage,
    resolve: {
      data: ScenarioStatusEventResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScenarioStatusEventUpdatePage,
    resolve: {
      data: ScenarioStatusEventResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ScenarioStatusEventPage, ScenarioStatusEventUpdatePage, ScenarioStatusEventDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ScenarioStatusEventPageModule {}
