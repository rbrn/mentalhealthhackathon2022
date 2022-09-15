import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ScenarioComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-scenario';
}

export class ScenarioUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-scenario-update';

  setOrderInput(order: string) {
    this.setInputValue('order', order);
  }

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setIdentifierInput(identifier: string) {
    this.setInputValue('identifier', identifier);
  }

  setTextInput(text: string) {
    this.setInputValue('text', text);
  }

  setAudioFileNameInput(audioFileName: string) {
    this.setInputValue('audioFileName', audioFileName);
  }

  setRntypeInput(rntype: string) {
    this.select('rntype', rntype);
  }

  setThemeInput(theme: string) {
    this.select('theme', theme);
  }

  setScenarioNumberInput(scenarioNumber: string) {
    this.setInputValue('scenarioNumber', scenarioNumber);
  }

  setTrialTypeInput(trialType: string) {
    this.select('trialType', trialType);
  }

  setRepeatableInput(repeatable: string) {
    this.setBoolean('repeatable', repeatable);
  }

  setPositivityInput(positivity: string) {
    this.setBoolean('positivity', positivity);
  }

  setVividnessInput(vividness: string) {
    this.setBoolean('vividness', vividness);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }
}

export class ScenarioDetailPage extends EntityDetailPage {
  pageSelector = 'page-scenario-detail';

  getOrderContent() {
    return cy.get('#order-content');
  }

  getNameContent() {
    return cy.get('#name-content');
  }

  getIdentifierContent() {
    return cy.get('#identifier-content');
  }

  getTextContent() {
    return cy.get('#text-content');
  }

  getAudioFileNameContent() {
    return cy.get('#audioFileName-content');
  }

  getRntypeContent() {
    return cy.get('#rntype-content');
  }

  getThemeContent() {
    return cy.get('#theme-content');
  }

  getScenarioNumberContent() {
    return cy.get('#scenarioNumber-content');
  }

  getTrialTypeContent() {
    return cy.get('#trialType-content');
  }

  getRepeatableContent() {
    return cy.get('#repeatable-content');
  }

  getPositivityContent() {
    return cy.get('#positivity-content');
  }

  getVividnessContent() {
    return cy.get('#vividness-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }
}
