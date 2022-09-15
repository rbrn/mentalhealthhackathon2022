import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class CategoryComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-category';
}

export class CategoryUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-category-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }
}

export class CategoryDetailPage extends EntityDetailPage {
  pageSelector = 'page-category-detail';

  getNameContent() {
    return cy.get('#name-content');
  }
}
