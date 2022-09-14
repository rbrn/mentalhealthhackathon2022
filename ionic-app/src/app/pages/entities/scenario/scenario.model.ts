import { BaseEntity } from 'src/model/base-entity';
import { Session } from '../session/session.model';

export const enum Category {
  'CAT1 (Bug)',
  'CAT2 (Feature)',
}

export const enum Subcategory {
  'SUBC1 (Bug)',
  'SUBC2 (Feature)',
}

export class Scenario implements BaseEntity {
  constructor(
    public id?: number,
    public order?: string,
    public name?: string,
    public identifier?: string,
    public text?: string,
    public audioFileName?: string,
    public rntype?: string,
    public theme?: string,
    public cathegory?: Category,
    public subcat?: Subcategory,
    public scenarioNumber?: string,
    public trialType?: string,
    public repeatable?: boolean,
    public positivity?: boolean,
    public vividness?: boolean,
    public createdDate?: any,
    public session?: Session
  ) {
    this.repeatable = false;
    this.positivity = false;
    this.vividness = false;
  }
}
