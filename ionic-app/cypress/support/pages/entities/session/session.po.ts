import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class SessionComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-session';
}

export class SessionUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-session-update';

  setOrderInput(order: string) {
    this.setInputValue('order', order);
  }

  setPercentageResolvedInput(percentageResolved: string) {
    this.setInputValue('percentageResolved', percentageResolved);
  }

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setSessionNumberInput(sessionNumber: string) {
    this.setInputValue('sessionNumber', sessionNumber);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }
}

export class SessionDetailPage extends EntityDetailPage {
  pageSelector = 'page-session-detail';

  getOrderContent() {
    return cy.get('#order-content');
  }

  getPercentageResolvedContent() {
    return cy.get('#percentageResolved-content');
  }

  getNameContent() {
    return cy.get('#name-content');
  }

  getSessionNumberContent() {
    return cy.get('#sessionNumber-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }
}
