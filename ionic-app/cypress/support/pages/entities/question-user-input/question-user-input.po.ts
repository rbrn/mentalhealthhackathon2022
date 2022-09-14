import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class QuestionUserInputComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-question-user-input';
}

export class QuestionUserInputUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-question-user-input-update';

  setUserIdInput(userId: string) {
    this.setInputValue('userId', userId);
  }

  setResponseInput(response: string) {
    this.setInputValue('response', response);
  }
}

export class QuestionUserInputDetailPage extends EntityDetailPage {
  pageSelector = 'page-question-user-input-detail';

  getUserIdContent() {
    return cy.get('#userId-content');
  }

  getResponseContent() {
    return cy.get('#response-content');
  }
}
