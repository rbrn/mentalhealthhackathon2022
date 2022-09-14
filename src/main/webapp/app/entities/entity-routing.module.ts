import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'session',
        data: { pageTitle: 'jhipsterApp.session.home.title' },
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
      },
      {
        path: 'scenario',
        data: { pageTitle: 'jhipsterApp.scenario.home.title' },
        loadChildren: () => import('./scenario/scenario.module').then(m => m.ScenarioModule),
      },
      {
        path: 'question',
        data: { pageTitle: 'jhipsterApp.question.home.title' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'question-user-input',
        data: { pageTitle: 'jhipsterApp.questionUserInput.home.title' },
        loadChildren: () => import('./question-user-input/question-user-input.module').then(m => m.QuestionUserInputModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
