import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { QuestionComponentsPage, QuestionDetailPage, QuestionUpdatePage } from '../../../support/pages/entities/question/question.po';
import questionSample from './question.json';

describe('Question entity', () => {
  const COMPONENT_TITLE = 'Questions';
  const SUBCOMPONENT_TITLE = 'Question';

  const questionPageUrl = '/tabs/entities/question';
  const questionApiUrl = '/api/questions';

  const questionComponentsPage = new QuestionComponentsPage();
  const questionUpdatePage = new QuestionUpdatePage();
  const questionDetailPage = new QuestionDetailPage();

  let question: any;

  beforeEach(() => {
    question = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Questions page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      questionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', questionPageUrl);

      questionComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Question page and go back', () => {
      cy.visit(questionPageUrl);
      questionComponentsPage.clickOnCreateButton();

      questionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      questionUpdatePage.back();
      cy.url().should('include', questionPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: questionApiUrl,
        body: questionSample,
      }).then(({ body }) => {
        question = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${questionApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [question],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (question) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${questionApiUrl}/${question.id}`,
        }).then(() => {
          question = undefined;
        });
      }
    });

    it('should open Question view, open Question edit and go back', () => {
      cy.visit(questionPageUrl);
      questionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      questionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (question.title !== undefined && question.title !== null) {
        questionDetailPage.getTitleContent().contains(question.title);
      }
      if (question.text !== undefined && question.text !== null) {
        questionDetailPage.getTextContent().contains(question.text);
      }
      questionDetailPage.edit();

      questionUpdatePage.back();
      questionDetailPage.back();
      cy.url().should('include', questionPageUrl);
    });

    it('should open Question view, open Question edit and save', () => {
      cy.visit(questionPageUrl);
      questionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      questionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      questionDetailPage.edit();

      questionUpdatePage.save();
      cy.url().should('include', questionPageUrl);
    });

    it('should delete Question', () => {
      cy.visit(questionPageUrl);
      questionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      questionDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      questionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      question = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: questionApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (question) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${questionApiUrl}/${question.id}`,
        }).then(() => {
          question = undefined;
        });
      }
    });

    it('should create Question', () => {
      cy.visit(questionPageUrl + '/new');

      questionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (questionSample.title !== undefined && questionSample.title !== null) {
        questionUpdatePage.setTitleInput(questionSample.title);
      }
      if (questionSample.text !== undefined && questionSample.text !== null) {
        questionUpdatePage.setTextInput(questionSample.text);
      }
      if (questionSample.correctAnswer !== undefined && questionSample.correctAnswer !== null) {
        questionUpdatePage.setCorrectAnswerInput(questionSample.correctAnswer);
      }
      if (questionSample.correctAnswerFeedback !== undefined && questionSample.correctAnswerFeedback !== null) {
        questionUpdatePage.setCorrectAnswerFeedbackInput(questionSample.correctAnswerFeedback);
      }
      if (questionSample.wrongAnswerFeedback !== undefined && questionSample.wrongAnswerFeedback !== null) {
        questionUpdatePage.setWrongAnswerFeedbackInput(questionSample.wrongAnswerFeedback);
      }
      if (questionSample.createdDate !== undefined && questionSample.createdDate !== null) {
        questionUpdatePage.setCreatedDateInput(questionSample.createdDate);
      }
      questionUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        question = body;
      });

      questionComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
