import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { ScenarioComponentsPage, ScenarioDetailPage, ScenarioUpdatePage } from '../../../support/pages/entities/scenario/scenario.po';
import scenarioSample from './scenario.json';

describe('Scenario entity', () => {
  const COMPONENT_TITLE = 'Scenarios';
  const SUBCOMPONENT_TITLE = 'Scenario';

  const scenarioPageUrl = '/tabs/entities/scenario';
  const scenarioApiUrl = '/api/scenarios';

  const scenarioComponentsPage = new ScenarioComponentsPage();
  const scenarioUpdatePage = new ScenarioUpdatePage();
  const scenarioDetailPage = new ScenarioDetailPage();

  let scenario: any;

  beforeEach(() => {
    scenario = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Scenarios page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      scenarioComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', scenarioPageUrl);

      scenarioComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Scenario page and go back', () => {
      cy.visit(scenarioPageUrl);
      scenarioComponentsPage.clickOnCreateButton();

      scenarioUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      scenarioUpdatePage.back();
      cy.url().should('include', scenarioPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: scenarioApiUrl,
        body: scenarioSample,
      }).then(({ body }) => {
        scenario = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${scenarioApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [scenario],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (scenario) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${scenarioApiUrl}/${scenario.id}`,
        }).then(() => {
          scenario = undefined;
        });
      }
    });

    it('should open Scenario view, open Scenario edit and go back', () => {
      cy.visit(scenarioPageUrl);
      scenarioComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      scenarioDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (scenario.order !== undefined && scenario.order !== null) {
        scenarioDetailPage.getOrderContent().contains(scenario.order);
      }
      if (scenario.name !== undefined && scenario.name !== null) {
        scenarioDetailPage.getNameContent().contains(scenario.name);
      }
      if (scenario.identifier !== undefined && scenario.identifier !== null) {
        scenarioDetailPage.getIdentifierContent().contains(scenario.identifier);
      }
      if (scenario.text !== undefined && scenario.text !== null) {
        scenarioDetailPage.getTextContent().contains(scenario.text);
      }
      if (scenario.audioFileName !== undefined && scenario.audioFileName !== null) {
        scenarioDetailPage.getAudioFileNameContent().contains(scenario.audioFileName);
      }
      if (scenario.scenarioNumber !== undefined && scenario.scenarioNumber !== null) {
        scenarioDetailPage.getScenarioNumberContent().contains(scenario.scenarioNumber);
      }
      scenarioDetailPage.edit();

      scenarioUpdatePage.back();
      scenarioDetailPage.back();
      cy.url().should('include', scenarioPageUrl);
    });

    it('should open Scenario view, open Scenario edit and save', () => {
      cy.visit(scenarioPageUrl);
      scenarioComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      scenarioDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      scenarioDetailPage.edit();

      scenarioUpdatePage.save();
      cy.url().should('include', scenarioPageUrl);
    });

    it('should delete Scenario', () => {
      cy.visit(scenarioPageUrl);
      scenarioComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      scenarioDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      scenarioComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      scenario = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: scenarioApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (scenario) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${scenarioApiUrl}/${scenario.id}`,
        }).then(() => {
          scenario = undefined;
        });
      }
    });

    it('should create Scenario', () => {
      cy.visit(scenarioPageUrl + '/new');

      scenarioUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (scenarioSample.order !== undefined && scenarioSample.order !== null) {
        scenarioUpdatePage.setOrderInput(scenarioSample.order);
      }
      if (scenarioSample.name !== undefined && scenarioSample.name !== null) {
        scenarioUpdatePage.setNameInput(scenarioSample.name);
      }
      if (scenarioSample.identifier !== undefined && scenarioSample.identifier !== null) {
        scenarioUpdatePage.setIdentifierInput(scenarioSample.identifier);
      }
      if (scenarioSample.text !== undefined && scenarioSample.text !== null) {
        scenarioUpdatePage.setTextInput(scenarioSample.text);
      }
      if (scenarioSample.audioFileName !== undefined && scenarioSample.audioFileName !== null) {
        scenarioUpdatePage.setAudioFileNameInput(scenarioSample.audioFileName);
      }
      if (scenarioSample.rntype !== undefined && scenarioSample.rntype !== null) {
        scenarioUpdatePage.setRntypeInput(scenarioSample.rntype);
      }
      if (scenarioSample.theme !== undefined && scenarioSample.theme !== null) {
        scenarioUpdatePage.setThemeInput(scenarioSample.theme);
      }
      if (scenarioSample.scenarioNumber !== undefined && scenarioSample.scenarioNumber !== null) {
        scenarioUpdatePage.setScenarioNumberInput(scenarioSample.scenarioNumber);
      }
      if (scenarioSample.trialType !== undefined && scenarioSample.trialType !== null) {
        scenarioUpdatePage.setTrialTypeInput(scenarioSample.trialType);
      }
      if (scenarioSample.repeatable !== undefined && scenarioSample.repeatable !== null) {
        scenarioUpdatePage.setRepeatableInput(scenarioSample.repeatable);
      }
      if (scenarioSample.positivity !== undefined && scenarioSample.positivity !== null) {
        scenarioUpdatePage.setPositivityInput(scenarioSample.positivity);
      }
      if (scenarioSample.vividness !== undefined && scenarioSample.vividness !== null) {
        scenarioUpdatePage.setVividnessInput(scenarioSample.vividness);
      }
      if (scenarioSample.createdDate !== undefined && scenarioSample.createdDate !== null) {
        scenarioUpdatePage.setCreatedDateInput(scenarioSample.createdDate);
      }
      scenarioUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        scenario = body;
      });

      scenarioComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
