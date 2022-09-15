import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ScenarioStatusEventComponentsPage,
  ScenarioStatusEventDetailPage,
  ScenarioStatusEventUpdatePage,
} from '../../../support/pages/entities/scenario-status-event/scenario-status-event.po';
import scenarioStatusEventSample from './scenario-status-event.json';

describe('ScenarioStatusEvent entity', () => {
  const COMPONENT_TITLE = 'Scenario Status Events';
  const SUBCOMPONENT_TITLE = 'Scenario Status Event';

  const scenarioStatusEventPageUrl = '/tabs/entities/scenario-status-event';
  const scenarioStatusEventApiUrl = '/api/scenario-status-events';

  const scenarioStatusEventComponentsPage = new ScenarioStatusEventComponentsPage();
  const scenarioStatusEventUpdatePage = new ScenarioStatusEventUpdatePage();
  const scenarioStatusEventDetailPage = new ScenarioStatusEventDetailPage();

  let scenarioStatusEvent: any;

  beforeEach(() => {
    scenarioStatusEvent = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ScenarioStatusEvents page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      scenarioStatusEventComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', scenarioStatusEventPageUrl);

      scenarioStatusEventComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ScenarioStatusEvent page and go back', () => {
      cy.visit(scenarioStatusEventPageUrl);
      scenarioStatusEventComponentsPage.clickOnCreateButton();

      scenarioStatusEventUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      scenarioStatusEventUpdatePage.back();
      cy.url().should('include', scenarioStatusEventPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: scenarioStatusEventApiUrl,
        body: scenarioStatusEventSample,
      }).then(({ body }) => {
        scenarioStatusEvent = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${scenarioStatusEventApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [scenarioStatusEvent],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (scenarioStatusEvent) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${scenarioStatusEventApiUrl}/${scenarioStatusEvent.id}`,
        }).then(() => {
          scenarioStatusEvent = undefined;
        });
      }
    });

    it('should open ScenarioStatusEvent view, open ScenarioStatusEvent edit and go back', () => {
      cy.visit(scenarioStatusEventPageUrl);
      scenarioStatusEventComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      scenarioStatusEventDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (scenarioStatusEvent.userId !== undefined && scenarioStatusEvent.userId !== null) {
        scenarioStatusEventDetailPage.getUserIdContent().contains(scenarioStatusEvent.userId);
      }
      scenarioStatusEventDetailPage.edit();

      scenarioStatusEventUpdatePage.back();
      scenarioStatusEventDetailPage.back();
      cy.url().should('include', scenarioStatusEventPageUrl);
    });

    it('should open ScenarioStatusEvent view, open ScenarioStatusEvent edit and save', () => {
      cy.visit(scenarioStatusEventPageUrl);
      scenarioStatusEventComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      scenarioStatusEventDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      scenarioStatusEventDetailPage.edit();

      scenarioStatusEventUpdatePage.save();
      cy.url().should('include', scenarioStatusEventPageUrl);
    });

    it('should delete ScenarioStatusEvent', () => {
      cy.visit(scenarioStatusEventPageUrl);
      scenarioStatusEventComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      scenarioStatusEventDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      scenarioStatusEventComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      scenarioStatusEvent = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: scenarioStatusEventApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (scenarioStatusEvent) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${scenarioStatusEventApiUrl}/${scenarioStatusEvent.id}`,
        }).then(() => {
          scenarioStatusEvent = undefined;
        });
      }
    });

    it('should create ScenarioStatusEvent', () => {
      cy.visit(scenarioStatusEventPageUrl + '/new');

      scenarioStatusEventUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (scenarioStatusEventSample.userId !== undefined && scenarioStatusEventSample.userId !== null) {
        scenarioStatusEventUpdatePage.setUserIdInput(scenarioStatusEventSample.userId);
      }
      if (scenarioStatusEventSample.eventType !== undefined && scenarioStatusEventSample.eventType !== null) {
        scenarioStatusEventUpdatePage.setEventTypeInput(scenarioStatusEventSample.eventType);
      }
      scenarioStatusEventUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        scenarioStatusEvent = body;
      });

      scenarioStatusEventComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
