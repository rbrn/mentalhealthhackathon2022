import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { CategoryComponentsPage, CategoryDetailPage, CategoryUpdatePage } from '../../../support/pages/entities/category/category.po';
import categorySample from './category.json';

describe('Category entity', () => {
  const COMPONENT_TITLE = 'Categories';
  const SUBCOMPONENT_TITLE = 'Category';

  const categoryPageUrl = '/tabs/entities/category';
  const categoryApiUrl = '/api/categories';

  const categoryComponentsPage = new CategoryComponentsPage();
  const categoryUpdatePage = new CategoryUpdatePage();
  const categoryDetailPage = new CategoryDetailPage();

  let category: any;

  beforeEach(() => {
    category = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Categories page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      categoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', categoryPageUrl);

      categoryComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Category page and go back', () => {
      cy.visit(categoryPageUrl);
      categoryComponentsPage.clickOnCreateButton();

      categoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      categoryUpdatePage.back();
      cy.url().should('include', categoryPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: categoryApiUrl,
        body: categorySample,
      }).then(({ body }) => {
        category = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${categoryApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [category],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (category) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${categoryApiUrl}/${category.id}`,
        }).then(() => {
          category = undefined;
        });
      }
    });

    it('should open Category view, open Category edit and go back', () => {
      cy.visit(categoryPageUrl);
      categoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      categoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (category.name !== undefined && category.name !== null) {
        categoryDetailPage.getNameContent().contains(category.name);
      }
      categoryDetailPage.edit();

      categoryUpdatePage.back();
      categoryDetailPage.back();
      cy.url().should('include', categoryPageUrl);
    });

    it('should open Category view, open Category edit and save', () => {
      cy.visit(categoryPageUrl);
      categoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      categoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      categoryDetailPage.edit();

      categoryUpdatePage.save();
      cy.url().should('include', categoryPageUrl);
    });

    it('should delete Category', () => {
      cy.visit(categoryPageUrl);
      categoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      categoryDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      categoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      category = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: categoryApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (category) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${categoryApiUrl}/${category.id}`,
        }).then(() => {
          category = undefined;
        });
      }
    });

    it('should create Category', () => {
      cy.visit(categoryPageUrl + '/new');

      categoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (categorySample.name !== undefined && categorySample.name !== null) {
        categoryUpdatePage.setNameInput(categorySample.name);
      }
      categoryUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        category = body;
      });

      categoryComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
