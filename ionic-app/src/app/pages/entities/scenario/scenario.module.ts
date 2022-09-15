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

import { ScenarioPage } from './scenario';
import { ScenarioUpdatePage } from './scenario-update';
import { Scenario, ScenarioService, ScenarioDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ScenarioResolve implements Resolve<Scenario> {
  constructor(private service: ScenarioService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Scenario> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Scenario>) => response.ok),
        map((scenario: HttpResponse<Scenario>) => scenario.body)
      );
    }
    return of(new Scenario());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ScenarioPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScenarioUpdatePage,
    resolve: {
      data: ScenarioResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScenarioDetailPage,
    resolve: {
      data: ScenarioResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScenarioUpdatePage,
    resolve: {
      data: ScenarioResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ScenarioPage, ScenarioUpdatePage, ScenarioDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ScenarioPageModule {}
