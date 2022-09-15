import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';

const routes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'session',
    loadChildren: () => import('./session/session.module').then(m => m.SessionPageModule),
  },
  {
    path: 'scenario',
    loadChildren: () => import('./scenario/scenario.module').then(m => m.ScenarioPageModule),
  },
  {
    path: 'question',
    loadChildren: () => import('./question/question.module').then(m => m.QuestionPageModule),
  },
  {
    path: 'question-user-input',
    loadChildren: () => import('./question-user-input/question-user-input.module').then(m => m.QuestionUserInputPageModule),
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryPageModule),
  },
  {
    path: 'sub-category',
    loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryPageModule),
  },
  {
    path: 'scenario-status-event',
    loadChildren: () => import('./scenario-status-event/scenario-status-event.module').then(m => m.ScenarioStatusEventPageModule),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}
