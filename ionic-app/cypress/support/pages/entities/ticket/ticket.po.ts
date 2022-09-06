import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class TicketComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-ticket';
}

export class TicketUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-ticket-update';

  setTitleInput(title: string) {
    this.setInputValue('title', title);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setDueDateInput(dueDate: string) {
    this.setDate('dueDate', dueDate);
  }

  setDateInput(date: string) {
    this.setDateTime('date', date);
  }

  setStatusInput(status: string) {
    this.select('status', status);
  }

  setTypeInput(type: string) {
    this.select('type', type);
  }

  setPriorityInput(priority: string) {
    this.select('priority', priority);
  }
}

export class TicketDetailPage extends EntityDetailPage {
  pageSelector = 'page-ticket-detail';

  getTitleContent() {
    return cy.get('#title-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getDueDateContent() {
    return cy.get('#dueDate-content');
  }

  getDateContent() {
    return cy.get('#date-content');
  }

  getStatusContent() {
    return cy.get('#status-content');
  }

  getTypeContent() {
    return cy.get('#type-content');
  }

  getPriorityContent() {
    return cy.get('#priority-content');
  }
}
