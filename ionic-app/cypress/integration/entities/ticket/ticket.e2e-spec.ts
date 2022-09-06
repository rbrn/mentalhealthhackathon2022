import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { TicketComponentsPage, TicketDetailPage, TicketUpdatePage } from '../../../support/pages/entities/ticket/ticket.po';
import ticketSample from './ticket.json';

describe('Ticket entity', () => {
  const COMPONENT_TITLE = 'Tickets';
  const SUBCOMPONENT_TITLE = 'Ticket';

  const ticketPageUrl = '/tabs/entities/ticket';
  const ticketApiUrl = '/api/tickets';

  const ticketComponentsPage = new TicketComponentsPage();
  const ticketUpdatePage = new TicketUpdatePage();
  const ticketDetailPage = new TicketDetailPage();

  let ticket: any;

  beforeEach(() => {
    ticket = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Tickets page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      ticketComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', ticketPageUrl);

      ticketComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Ticket page and go back', () => {
      cy.visit(ticketPageUrl);
      ticketComponentsPage.clickOnCreateButton();

      ticketUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      ticketUpdatePage.back();
      cy.url().should('include', ticketPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: ticketApiUrl,
        body: ticketSample,
      }).then(({ body }) => {
        ticket = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${ticketApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [ticket],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (ticket) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${ticketApiUrl}/${ticket.id}`,
        }).then(() => {
          ticket = undefined;
        });
      }
    });

    it('should open Ticket view, open Ticket edit and go back', () => {
      cy.visit(ticketPageUrl);
      ticketComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      ticketDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (ticket.title !== undefined && ticket.title !== null) {
        ticketDetailPage.getTitleContent().contains(ticket.title);
      }
      if (ticket.description !== undefined && ticket.description !== null) {
        ticketDetailPage.getDescriptionContent().contains(ticket.description);
      }
      ticketDetailPage.edit();

      ticketUpdatePage.back();
      ticketDetailPage.back();
      cy.url().should('include', ticketPageUrl);
    });

    it('should open Ticket view, open Ticket edit and save', () => {
      cy.visit(ticketPageUrl);
      ticketComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      ticketDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      ticketDetailPage.edit();

      ticketUpdatePage.save();
      cy.url().should('include', ticketPageUrl);
    });

    it('should delete Ticket', () => {
      cy.visit(ticketPageUrl);
      ticketComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      ticketDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      ticketComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      ticket = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: ticketApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (ticket) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${ticketApiUrl}/${ticket.id}`,
        }).then(() => {
          ticket = undefined;
        });
      }
    });

    it('should create Ticket', () => {
      cy.visit(ticketPageUrl + '/new');

      ticketUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (ticketSample.title !== undefined && ticketSample.title !== null) {
        ticketUpdatePage.setTitleInput(ticketSample.title);
      }
      if (ticketSample.description !== undefined && ticketSample.description !== null) {
        ticketUpdatePage.setDescriptionInput(ticketSample.description);
      }
      if (ticketSample.dueDate !== undefined && ticketSample.dueDate !== null) {
        ticketUpdatePage.setDueDateInput(ticketSample.dueDate);
      }
      if (ticketSample.date !== undefined && ticketSample.date !== null) {
        ticketUpdatePage.setDateInput(ticketSample.date);
      }
      if (ticketSample.status !== undefined && ticketSample.status !== null) {
        ticketUpdatePage.setStatusInput(ticketSample.status);
      }
      if (ticketSample.type !== undefined && ticketSample.type !== null) {
        ticketUpdatePage.setTypeInput(ticketSample.type);
      }
      if (ticketSample.priority !== undefined && ticketSample.priority !== null) {
        ticketUpdatePage.setPriorityInput(ticketSample.priority);
      }
      ticketUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        ticket = body;
      });

      ticketComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
