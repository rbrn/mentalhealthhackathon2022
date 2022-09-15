import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  QuestionUserInputComponentsPage,
  QuestionUserInputDetailPage,
  QuestionUserInputUpdatePage,
} from '../../../support/pages/entities/question-user-input/question-user-input.po';
import questionUserInputSample from './question-user-input.json';

describe('QuestionUserInput entity', () => {
  const COMPONENT_TITLE = 'Question User Inputs';
  const SUBCOMPONENT_TITLE = 'Question User Input';

  const questionUserInputPageUrl = '/tabs/entities/question-user-input';
  const questionUserInputApiUrl = '/api/question-user-inputs';

  const questionUserInputComponentsPage = new QuestionUserInputComponentsPage();
  const questionUserInputUpdatePage = new QuestionUserInputUpdatePage();
  const questionUserInputDetailPage = new QuestionUserInputDetailPage();

  let questionUserInput: any;

  beforeEach(() => {
    questionUserInput = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load QuestionUserInputs page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      questionUserInputComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', questionUserInputPageUrl);

      questionUserInputComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create QuestionUserInput page and go back', () => {
      cy.visit(questionUserInputPageUrl);
      questionUserInputComponentsPage.clickOnCreateButton();

      questionUserInputUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      questionUserInputUpdatePage.back();
      cy.url().should('include', questionUserInputPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: questionUserInputApiUrl,
        body: questionUserInputSample,
      }).then(({ body }) => {
        questionUserInput = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${questionUserInputApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [questionUserInput],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (questionUserInput) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${questionUserInputApiUrl}/${questionUserInput.id}`,
        }).then(() => {
          questionUserInput = undefined;
        });
      }
    });

    it('should open QuestionUserInput view, open QuestionUserInput edit and go back', () => {
      cy.visit(questionUserInputPageUrl);
      questionUserInputComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      questionUserInputDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (questionUserInput.userId !== undefined && questionUserInput.userId !== null) {
        questionUserInputDetailPage.getUserIdContent().contains(questionUserInput.userId);
      }
      if (questionUserInput.response !== undefined && questionUserInput.response !== null) {
        questionUserInputDetailPage.getResponseContent().contains(questionUserInput.response);
      }
      questionUserInputDetailPage.edit();

      questionUserInputUpdatePage.back();
      questionUserInputDetailPage.back();
      cy.url().should('include', questionUserInputPageUrl);
    });

    it('should open QuestionUserInput view, open QuestionUserInput edit and save', () => {
      cy.visit(questionUserInputPageUrl);
      questionUserInputComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      questionUserInputDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      questionUserInputDetailPage.edit();

      questionUserInputUpdatePage.save();
      cy.url().should('include', questionUserInputPageUrl);
    });

    it('should delete QuestionUserInput', () => {
      cy.visit(questionUserInputPageUrl);
      questionUserInputComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      questionUserInputDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      questionUserInputComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      questionUserInput = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: questionUserInputApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (questionUserInput) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${questionUserInputApiUrl}/${questionUserInput.id}`,
        }).then(() => {
          questionUserInput = undefined;
        });
      }
    });

    it('should create QuestionUserInput', () => {
      cy.visit(questionUserInputPageUrl + '/new');

      questionUserInputUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (questionUserInputSample.userId !== undefined && questionUserInputSample.userId !== null) {
        questionUserInputUpdatePage.setUserIdInput(questionUserInputSample.userId);
      }
      if (questionUserInputSample.response !== undefined && questionUserInputSample.response !== null) {
        questionUserInputUpdatePage.setResponseInput(questionUserInputSample.response);
      }
      questionUserInputUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        questionUserInput = body;
      });

      questionUserInputComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
