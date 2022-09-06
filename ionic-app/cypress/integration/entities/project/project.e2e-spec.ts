import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { ProjectComponentsPage, ProjectDetailPage, ProjectUpdatePage } from '../../../support/pages/entities/project/project.po';
import projectSample from './project.json';

describe('Project entity', () => {
  const COMPONENT_TITLE = 'Projects';
  const SUBCOMPONENT_TITLE = 'Project';

  const projectPageUrl = '/tabs/entities/project';
  const projectApiUrl = '/api/projects';

  const projectComponentsPage = new ProjectComponentsPage();
  const projectUpdatePage = new ProjectUpdatePage();
  const projectDetailPage = new ProjectDetailPage();

  let project: any;

  beforeEach(() => {
    project = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Projects page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      projectComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', projectPageUrl);

      projectComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Project page and go back', () => {
      cy.visit(projectPageUrl);
      projectComponentsPage.clickOnCreateButton();

      projectUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      projectUpdatePage.back();
      cy.url().should('include', projectPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: projectApiUrl,
        body: projectSample,
      }).then(({ body }) => {
        project = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${projectApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [project],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (project) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${projectApiUrl}/${project.id}`,
        }).then(() => {
          project = undefined;
        });
      }
    });

    it('should open Project view, open Project edit and go back', () => {
      cy.visit(projectPageUrl);
      projectComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      projectDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (project.name !== undefined && project.name !== null) {
        projectDetailPage.getNameContent().contains(project.name);
      }
      projectDetailPage.edit();

      projectUpdatePage.back();
      projectDetailPage.back();
      cy.url().should('include', projectPageUrl);
    });

    it('should open Project view, open Project edit and save', () => {
      cy.visit(projectPageUrl);
      projectComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      projectDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      projectDetailPage.edit();

      projectUpdatePage.save();
      cy.url().should('include', projectPageUrl);
    });

    it('should delete Project', () => {
      cy.visit(projectPageUrl);
      projectComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      projectDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      projectComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      project = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: projectApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (project) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${projectApiUrl}/${project.id}`,
        }).then(() => {
          project = undefined;
        });
      }
    });

    it('should create Project', () => {
      cy.visit(projectPageUrl + '/new');

      projectUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (projectSample.name !== undefined && projectSample.name !== null) {
        projectUpdatePage.setNameInput(projectSample.name);
      }
      projectUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        project = body;
      });

      projectComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
