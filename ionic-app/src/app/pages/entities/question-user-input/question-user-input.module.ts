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

import { QuestionUserInputPage } from './question-user-input';
import { QuestionUserInputUpdatePage } from './question-user-input-update';
import { QuestionUserInput, QuestionUserInputService, QuestionUserInputDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class QuestionUserInputResolve implements Resolve<QuestionUserInput> {
  constructor(private service: QuestionUserInputService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuestionUserInput> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<QuestionUserInput>) => response.ok),
        map((questionUserInput: HttpResponse<QuestionUserInput>) => questionUserInput.body)
      );
    }
    return of(new QuestionUserInput());
  }
}

const routes: Routes = [
  {
    path: '',
    component: QuestionUserInputPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuestionUserInputUpdatePage,
    resolve: {
      data: QuestionUserInputResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuestionUserInputDetailPage,
    resolve: {
      data: QuestionUserInputResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuestionUserInputUpdatePage,
    resolve: {
      data: QuestionUserInputResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [QuestionUserInputPage, QuestionUserInputUpdatePage, QuestionUserInputDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class QuestionUserInputPageModule {}
