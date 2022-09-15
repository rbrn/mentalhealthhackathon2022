import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ScenarioStatusEventComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-scenario-status-event';
}

export class ScenarioStatusEventUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-scenario-status-event-update';

  setUserIdInput(userId: string) {
    this.setInputValue('userId', userId);
  }

  setEventTypeInput(eventType: string) {
    this.select('eventType', eventType);
  }
}

export class ScenarioStatusEventDetailPage extends EntityDetailPage {
  pageSelector = 'page-scenario-status-event-detail';

  getUserIdContent() {
    return cy.get('#userId-content');
  }

  getEventTypeContent() {
    return cy.get('#eventType-content');
  }
}
