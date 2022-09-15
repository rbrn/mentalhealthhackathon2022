import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'session',
        data: { pageTitle: 'metalHealthApp.session.home.title' },
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
      },
      {
        path: 'scenario',
        data: { pageTitle: 'metalHealthApp.scenario.home.title' },
        loadChildren: () => import('./scenario/scenario.module').then(m => m.ScenarioModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'metalHealthApp.question.home.title' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'question-user-input',
        data: { pageTitle: 'metalHealthApp.questionUserInput.home.title' },
        loadChildren: () => import('./question-user-input/question-user-input.module').then(m => m.QuestionUserInputModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'metalHealthApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'sub-category',
        data: { pageTitle: 'metalHealthApp.subCategory.home.title' },
        loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryModule),
      },
      {
        path: 'scenario-status-event',
        data: { pageTitle: 'metalHealthApp.scenarioStatusEvent.home.title' },
        loadChildren: () => import('./scenario-status-event/scenario-status-event.module').then(m => m.ScenarioStatusEventModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
