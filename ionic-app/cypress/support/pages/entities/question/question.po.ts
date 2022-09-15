import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class QuestionComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-question';
}

export class QuestionUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-question-update';

  setTitleInput(title: string) {
    this.setInputValue('title', title);
  }

  setTextInput(text: string) {
    this.setInputValue('text', text);
  }

  setCorrectAnswerInput(correctAnswer: string) {
    this.setBoolean('correctAnswer', correctAnswer);
  }

  setCorrectAnswerFeedbackInput(correctAnswerFeedback: string) {
    this.setBoolean('correctAnswerFeedback', correctAnswerFeedback);
  }

  setWrongAnswerFeedbackInput(wrongAnswerFeedback: string) {
    this.setBoolean('wrongAnswerFeedback', wrongAnswerFeedback);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }
}

export class QuestionDetailPage extends EntityDetailPage {
  pageSelector = 'page-question-detail';

  getTitleContent() {
    return cy.get('#title-content');
  }

  getTextContent() {
    return cy.get('#text-content');
  }

  getCorrectAnswerContent() {
    return cy.get('#correctAnswer-content');
  }

  getCorrectAnswerFeedbackContent() {
    return cy.get('#correctAnswerFeedback-content');
  }

  getWrongAnswerFeedbackContent() {
    return cy.get('#wrongAnswerFeedback-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }
}
