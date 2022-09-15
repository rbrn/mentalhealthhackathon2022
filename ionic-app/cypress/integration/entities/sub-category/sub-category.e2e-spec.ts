import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  SubCategoryComponentsPage,
  SubCategoryDetailPage,
  SubCategoryUpdatePage,
} from '../../../support/pages/entities/sub-category/sub-category.po';
import subCategorySample from './sub-category.json';

describe('SubCategory entity', () => {
  const COMPONENT_TITLE = 'Sub Categories';
  const SUBCOMPONENT_TITLE = 'Sub Category';

  const subCategoryPageUrl = '/tabs/entities/sub-category';
  const subCategoryApiUrl = '/api/sub-categories';

  const subCategoryComponentsPage = new SubCategoryComponentsPage();
  const subCategoryUpdatePage = new SubCategoryUpdatePage();
  const subCategoryDetailPage = new SubCategoryDetailPage();

  let subCategory: any;

  beforeEach(() => {
    subCategory = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load SubCategories page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      subCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', subCategoryPageUrl);

      subCategoryComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create SubCategory page and go back', () => {
      cy.visit(subCategoryPageUrl);
      subCategoryComponentsPage.clickOnCreateButton();

      subCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      subCategoryUpdatePage.back();
      cy.url().should('include', subCategoryPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: subCategoryApiUrl,
        body: subCategorySample,
      }).then(({ body }) => {
        subCategory = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${subCategoryApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [subCategory],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (subCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${subCategoryApiUrl}/${subCategory.id}`,
        }).then(() => {
          subCategory = undefined;
        });
      }
    });

    it('should open SubCategory view, open SubCategory edit and go back', () => {
      cy.visit(subCategoryPageUrl);
      subCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      subCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (subCategory.name !== undefined && subCategory.name !== null) {
        subCategoryDetailPage.getNameContent().contains(subCategory.name);
      }
      subCategoryDetailPage.edit();

      subCategoryUpdatePage.back();
      subCategoryDetailPage.back();
      cy.url().should('include', subCategoryPageUrl);
    });

    it('should open SubCategory view, open SubCategory edit and save', () => {
      cy.visit(subCategoryPageUrl);
      subCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      subCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      subCategoryDetailPage.edit();

      subCategoryUpdatePage.save();
      cy.url().should('include', subCategoryPageUrl);
    });

    it('should delete SubCategory', () => {
      cy.visit(subCategoryPageUrl);
      subCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      subCategoryDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      subCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      subCategory = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: subCategoryApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (subCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${subCategoryApiUrl}/${subCategory.id}`,
        }).then(() => {
          subCategory = undefined;
        });
      }
    });

    it('should create SubCategory', () => {
      cy.visit(subCategoryPageUrl + '/new');

      subCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (subCategorySample.name !== undefined && subCategorySample.name !== null) {
        subCategoryUpdatePage.setNameInput(subCategorySample.name);
      }
      subCategoryUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        subCategory = body;
      });

      subCategoryComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
