import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class SubCategoryComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-sub-category';
}

export class SubCategoryUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-sub-category-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }
}

export class SubCategoryDetailPage extends EntityDetailPage {
  pageSelector = 'page-sub-category-detail';

  getNameContent() {
    return cy.get('#name-content');
  }
}
