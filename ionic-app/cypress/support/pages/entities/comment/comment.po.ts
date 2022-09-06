import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class CommentComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-comment';
}

export class CommentUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-comment-update';

  setDateInput(date: string) {
    this.setDateTime('date', date);
  }

  setTextInput(text: string) {
    this.setInputValue('text', text);
  }
}

export class CommentDetailPage extends EntityDetailPage {
  pageSelector = 'page-comment-detail';

  getDateContent() {
    return cy.get('#date-content');
  }

  getTextContent() {
    return cy.get('#text-content');
  }
}
