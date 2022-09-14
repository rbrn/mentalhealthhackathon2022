import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { SessionComponentsPage, SessionDetailPage, SessionUpdatePage } from '../../../support/pages/entities/session/session.po';
import sessionSample from './session.json';

describe('Session entity', () => {
  const COMPONENT_TITLE = 'Sessions';
  const SUBCOMPONENT_TITLE = 'Session';

  const sessionPageUrl = '/tabs/entities/session';
  const sessionApiUrl = '/api/sessions';

  const sessionComponentsPage = new SessionComponentsPage();
  const sessionUpdatePage = new SessionUpdatePage();
  const sessionDetailPage = new SessionDetailPage();

  let session: any;

  beforeEach(() => {
    session = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Sessions page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      sessionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', sessionPageUrl);

      sessionComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Session page and go back', () => {
      cy.visit(sessionPageUrl);
      sessionComponentsPage.clickOnCreateButton();

      sessionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      sessionUpdatePage.back();
      cy.url().should('include', sessionPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: sessionApiUrl,
        body: sessionSample,
      }).then(({ body }) => {
        session = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${sessionApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [session],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (session) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${sessionApiUrl}/${session.id}`,
        }).then(() => {
          session = undefined;
        });
      }
    });

    it('should open Session view, open Session edit and go back', () => {
      cy.visit(sessionPageUrl);
      sessionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      sessionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (session.order !== undefined && session.order !== null) {
        sessionDetailPage.getOrderContent().contains(session.order);
      }
      if (session.percentageResolved !== undefined && session.percentageResolved !== null) {
        sessionDetailPage.getPercentageResolvedContent().contains(session.percentageResolved);
      }
      if (session.name !== undefined && session.name !== null) {
        sessionDetailPage.getNameContent().contains(session.name);
      }
      sessionDetailPage.edit();

      sessionUpdatePage.back();
      sessionDetailPage.back();
      cy.url().should('include', sessionPageUrl);
    });

    it('should open Session view, open Session edit and save', () => {
      cy.visit(sessionPageUrl);
      sessionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      sessionDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      sessionDetailPage.edit();

      sessionUpdatePage.save();
      cy.url().should('include', sessionPageUrl);
    });

    it('should delete Session', () => {
      cy.visit(sessionPageUrl);
      sessionComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      sessionDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      sessionComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      session = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: sessionApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (session) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${sessionApiUrl}/${session.id}`,
        }).then(() => {
          session = undefined;
        });
      }
    });

    it('should create Session', () => {
      cy.visit(sessionPageUrl + '/new');

      sessionUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (sessionSample.order !== undefined && sessionSample.order !== null) {
        sessionUpdatePage.setOrderInput(sessionSample.order);
      }
      if (sessionSample.percentageResolved !== undefined && sessionSample.percentageResolved !== null) {
        sessionUpdatePage.setPercentageResolvedInput(sessionSample.percentageResolved);
      }
      if (sessionSample.name !== undefined && sessionSample.name !== null) {
        sessionUpdatePage.setNameInput(sessionSample.name);
      }
      if (sessionSample.createdDate !== undefined && sessionSample.createdDate !== null) {
        sessionUpdatePage.setCreatedDateInput(sessionSample.createdDate);
      }
      sessionUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        session = body;
      });

      sessionComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
