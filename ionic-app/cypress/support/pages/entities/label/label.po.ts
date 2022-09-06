import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class LabelComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-label';
}

export class LabelUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-label-update';

  setLabelInput(label: string) {
    this.setInputValue('label', label);
  }
}

export class LabelDetailPage extends EntityDetailPage {
  pageSelector = 'page-label-detail';

  getLabelContent() {
    return cy.get('#label-content');
  }
}
