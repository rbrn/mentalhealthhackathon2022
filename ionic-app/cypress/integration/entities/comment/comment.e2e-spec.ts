import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { CommentComponentsPage, CommentDetailPage, CommentUpdatePage } from '../../../support/pages/entities/comment/comment.po';
import commentSample from './comment.json';

describe('Comment entity', () => {
  const COMPONENT_TITLE = 'Comments';
  const SUBCOMPONENT_TITLE = 'Comment';

  const commentPageUrl = '/tabs/entities/comment';
  const commentApiUrl = '/api/comments';

  const commentComponentsPage = new CommentComponentsPage();
  const commentUpdatePage = new CommentUpdatePage();
  const commentDetailPage = new CommentDetailPage();

  let comment: any;

  beforeEach(() => {
    comment = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Comments page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      commentComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', commentPageUrl);

      commentComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Comment page and go back', () => {
      cy.visit(commentPageUrl);
      commentComponentsPage.clickOnCreateButton();

      commentUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      commentUpdatePage.back();
      cy.url().should('include', commentPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: commentApiUrl,
        body: commentSample,
      }).then(({ body }) => {
        comment = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${commentApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [comment],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (comment) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${commentApiUrl}/${comment.id}`,
        }).then(() => {
          comment = undefined;
        });
      }
    });

    it('should open Comment view, open Comment edit and go back', () => {
      cy.visit(commentPageUrl);
      commentComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      commentDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (comment.text !== undefined && comment.text !== null) {
        commentDetailPage.getTextContent().contains(comment.text);
      }
      commentDetailPage.edit();

      commentUpdatePage.back();
      commentDetailPage.back();
      cy.url().should('include', commentPageUrl);
    });

    it('should open Comment view, open Comment edit and save', () => {
      cy.visit(commentPageUrl);
      commentComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      commentDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      commentDetailPage.edit();

      commentUpdatePage.save();
      cy.url().should('include', commentPageUrl);
    });

    it('should delete Comment', () => {
      cy.visit(commentPageUrl);
      commentComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      commentDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      commentComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      comment = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: commentApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (comment) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${commentApiUrl}/${comment.id}`,
        }).then(() => {
          comment = undefined;
        });
      }
    });

    it('should create Comment', () => {
      cy.visit(commentPageUrl + '/new');

      commentUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (commentSample.date !== undefined && commentSample.date !== null) {
        commentUpdatePage.setDateInput(commentSample.date);
      }
      if (commentSample.text !== undefined && commentSample.text !== null) {
        commentUpdatePage.setTextInput(commentSample.text);
      }
      commentUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        comment = body;
      });

      commentComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
