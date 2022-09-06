import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AttachmentComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-attachment';
}

export class AttachmentUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-attachment-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setFileInput(file: string) {
    this.setBlob('file', file);
  }
}

export class AttachmentDetailPage extends EntityDetailPage {
  pageSelector = 'page-attachment-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getFileContent() {
    return cy.get('#file-content');
  }
}
