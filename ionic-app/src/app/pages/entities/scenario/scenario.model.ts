import { BaseEntity } from 'src/model/base-entity';
import { Category } from '../category/category.model';
import { SubCategory } from '../sub-category/sub-category.model';
import { Question } from '../question/question.model';
import { ScenarioStatusEvent } from '../scenario-status-event/scenario-status-event.model';
import { Session } from '../session/session.model';

export const enum RntType {
  'WORRY (Worry)',
  'RUMINATION (Rumination)',
}

export const enum Theme {
  'DOMESTIC (Domestic)',
  'NON_DOMESTIC (Non-domestic)',
}

export const enum TrialType {
  'P_ENUM (P)',
  'SG_ENUM (SG)',
}

export class Scenario implements BaseEntity {
  constructor(
    public id?: number,
    public order?: string,
    public name?: string,
    public identifier?: string,
    public text?: string,
    public audioFileName?: string,
    public rntype?: RntType,
    public theme?: Theme,
    public scenarioNumber?: string,
    public trialType?: TrialType,
    public repeatable?: boolean,
    public positivity?: boolean,
    public vividness?: boolean,
    public createdDate?: any,
    public category?: Category,
    public subcategory?: SubCategory,
    public question?: Question,
    public sessionStatuses?: ScenarioStatusEvent[],
    public session?: Session
  ) {
    this.repeatable = false;
    this.positivity = false;
    this.vividness = false;
  }
}
