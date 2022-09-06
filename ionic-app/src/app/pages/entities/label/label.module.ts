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

import { LabelPage } from './label';
import { LabelUpdatePage } from './label-update';
import { Label, LabelService, LabelDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class LabelResolve implements Resolve<Label> {
  constructor(private service: LabelService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Label> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Label>) => response.ok),
        map((label: HttpResponse<Label>) => label.body)
      );
    }
    return of(new Label());
  }
}

const routes: Routes = [
  {
    path: '',
    component: LabelPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LabelUpdatePage,
    resolve: {
      data: LabelResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LabelDetailPage,
    resolve: {
      data: LabelResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LabelUpdatePage,
    resolve: {
      data: LabelResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [LabelPage, LabelUpdatePage, LabelDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class LabelPageModule {}
