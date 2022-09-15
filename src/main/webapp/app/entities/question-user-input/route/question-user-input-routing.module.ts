import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QuestionUserInputComponent } from '../list/question-user-input.component';
import { QuestionUserInputDetailComponent } from '../detail/question-user-input-detail.component';
import { QuestionUserInputUpdateComponent } from '../update/question-user-input-update.component';
import { QuestionUserInputRoutingResolveService } from './question-user-input-routing-resolve.service';

const questionUserInputRoute: Routes = [
  {
    path: '',
    component: QuestionUserInputComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuestionUserInputDetailComponent,
    resolve: {
      questionUserInput: QuestionUserInputRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuestionUserInputUpdateComponent,
    resolve: {
      questionUserInput: QuestionUserInputRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuestionUserInputUpdateComponent,
    resolve: {
      questionUserInput: QuestionUserInputRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(questionUserInputRoute)],
  exports: [RouterModule],
})
export class QuestionUserInputRoutingModule {}
