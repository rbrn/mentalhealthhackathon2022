import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AttachmentComponentsPage,
  AttachmentDetailPage,
  AttachmentUpdatePage,
} from '../../../support/pages/entities/attachment/attachment.po';
import attachmentSample from './attachment.json';

describe('Attachment entity', () => {
  const COMPONENT_TITLE = 'Attachments';
  const SUBCOMPONENT_TITLE = 'Attachment';

  const attachmentPageUrl = '/tabs/entities/attachment';
  const attachmentApiUrl = '/api/attachments';

  const attachmentComponentsPage = new AttachmentComponentsPage();
  const attachmentUpdatePage = new AttachmentUpdatePage();
  const attachmentDetailPage = new AttachmentDetailPage();

  let attachment: any;

  beforeEach(() => {
    attachment = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Attachments page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      attachmentComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', attachmentPageUrl);

      attachmentComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Attachment page and go back', () => {
      cy.visit(attachmentPageUrl);
      attachmentComponentsPage.clickOnCreateButton();

      attachmentUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      attachmentUpdatePage.back();
      cy.url().should('include', attachmentPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: attachmentApiUrl,
        body: attachmentSample,
      }).then(({ body }) => {
        attachment = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${attachmentApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [attachment],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (attachment) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${attachmentApiUrl}/${attachment.id}`,
        }).then(() => {
          attachment = undefined;
        });
      }
    });

    it('should open Attachment view, open Attachment edit and go back', () => {
      cy.visit(attachmentPageUrl);
      attachmentComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      attachmentDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (attachment.name !== undefined && attachment.name !== null) {
        attachmentDetailPage.getNameContent().contains(attachment.name);
      }
      attachmentDetailPage.edit();

      attachmentUpdatePage.back();
      attachmentDetailPage.back();
      cy.url().should('include', attachmentPageUrl);
    });

    it('should open Attachment view, open Attachment edit and save', () => {
      cy.visit(attachmentPageUrl);
      attachmentComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      attachmentDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      attachmentDetailPage.edit();

      attachmentUpdatePage.save();
      cy.url().should('include', attachmentPageUrl);
    });

    it('should delete Attachment', () => {
      cy.visit(attachmentPageUrl);
      attachmentComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      attachmentDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      attachmentComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      attachment = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: attachmentApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (attachment) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${attachmentApiUrl}/${attachment.id}`,
        }).then(() => {
          attachment = undefined;
        });
      }
    });

    it('should create Attachment', () => {
      cy.visit(attachmentPageUrl + '/new');

      attachmentUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (attachmentSample.name !== undefined && attachmentSample.name !== null) {
        attachmentUpdatePage.setNameInput(attachmentSample.name);
      }
      if (attachmentSample.file !== undefined && attachmentSample.file !== null) {
        attachmentUpdatePage.setFileInput(attachmentSample.file);
      }
      attachmentUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        attachment = body;
      });

      attachmentComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
