import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProjectComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-project';
}

export class ProjectUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-project-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }
}

export class ProjectDetailPage extends EntityDetailPage {
  pageSelector = 'page-project-detail';

  getNameContent() {
    return cy.get('#name-content');
  }
}
