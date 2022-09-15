import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Session', component: 'SessionPage', route: 'session' },
    { name: 'Scenario', component: 'ScenarioPage', route: 'scenario' },
    { name: 'Question', component: 'QuestionPage', route: 'question' },
    { name: 'Question User Input', component: 'QuestionUserInputPage', route: 'question-user-input' },
    { name: 'Category', component: 'CategoryPage', route: 'category' },
    { name: 'Sub Category', component: 'SubCategoryPage', route: 'sub-category' },
    { name: 'Scenario Status Event', component: 'ScenarioStatusEventPage', route: 'scenario-status-event' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
