import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { LabelComponentsPage, LabelDetailPage, LabelUpdatePage } from '../../../support/pages/entities/label/label.po';
import labelSample from './label.json';

describe('Label entity', () => {
  const COMPONENT_TITLE = 'Labels';
  const SUBCOMPONENT_TITLE = 'Label';

  const labelPageUrl = '/tabs/entities/label';
  const labelApiUrl = '/api/labels';

  const labelComponentsPage = new LabelComponentsPage();
  const labelUpdatePage = new LabelUpdatePage();
  const labelDetailPage = new LabelDetailPage();

  let label: any;

  beforeEach(() => {
    label = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Labels page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      labelComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', labelPageUrl);

      labelComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Label page and go back', () => {
      cy.visit(labelPageUrl);
      labelComponentsPage.clickOnCreateButton();

      labelUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      labelUpdatePage.back();
      cy.url().should('include', labelPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: labelApiUrl,
        body: labelSample,
      }).then(({ body }) => {
        label = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${labelApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [label],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (label) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${labelApiUrl}/${label.id}`,
        }).then(() => {
          label = undefined;
        });
      }
    });

    it('should open Label view, open Label edit and go back', () => {
      cy.visit(labelPageUrl);
      labelComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      labelDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (label.label !== undefined && label.label !== null) {
        labelDetailPage.getLabelContent().contains(label.label);
      }
      labelDetailPage.edit();

      labelUpdatePage.back();
      labelDetailPage.back();
      cy.url().should('include', labelPageUrl);
    });

    it('should open Label view, open Label edit and save', () => {
      cy.visit(labelPageUrl);
      labelComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      labelDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      labelDetailPage.edit();

      labelUpdatePage.save();
      cy.url().should('include', labelPageUrl);
    });

    it('should delete Label', () => {
      cy.visit(labelPageUrl);
      labelComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      labelDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      labelComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      label = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: labelApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (label) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${labelApiUrl}/${label.id}`,
        }).then(() => {
          label = undefined;
        });
      }
    });

    it('should create Label', () => {
      cy.visit(labelPageUrl + '/new');

      labelUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (labelSample.label !== undefined && labelSample.label !== null) {
        labelUpdatePage.setLabelInput(labelSample.label);
      }
      labelUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        label = body;
      });

      labelComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
