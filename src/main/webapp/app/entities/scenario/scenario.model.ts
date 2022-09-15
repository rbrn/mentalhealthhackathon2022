import dayjs from 'dayjs/esm';
import { ICategory } from 'app/entities/category/category.model';
import { ISubCategory } from 'app/entities/sub-category/sub-category.model';
import { IQuestion } from 'app/entities/question/question.model';
import { IScenarioStatusEvent } from 'app/entities/scenario-status-event/scenario-status-event.model';
import { ISession } from 'app/entities/session/session.model';
import { RntType } from 'app/entities/enumerations/rnt-type.model';
import { Theme } from 'app/entities/enumerations/theme.model';
import { TrialType } from 'app/entities/enumerations/trial-type.model';

export interface IScenario {
  id?: number;
  order?: string;
  name?: string;
  identifier?: string;
  text?: string;
  audioFileName?: string;
  rntype?: RntType | null;
  theme?: Theme | null;
  scenarioNumber?: string | null;
  trialType?: TrialType | null;
  repeatable?: boolean | null;
  positivity?: boolean | null;
  vividness?: boolean | null;
  createdDate?: dayjs.Dayjs | null;
  category?: ICategory | null;
  subcategory?: ISubCategory | null;
  question?: IQuestion | null;
  sessionStatuses?: IScenarioStatusEvent[] | null;
  session?: ISession | null;
}

export class Scenario implements IScenario {
  constructor(
    public id?: number,
    public order?: string,
    public name?: string,
    public identifier?: string,
    public text?: string,
    public audioFileName?: string,
    public rntype?: RntType | null,
    public theme?: Theme | null,
    public scenarioNumber?: string | null,
    public trialType?: TrialType | null,
    public repeatable?: boolean | null,
    public positivity?: boolean | null,
    public vividness?: boolean | null,
    public createdDate?: dayjs.Dayjs | null,
    public category?: ICategory | null,
    public subcategory?: ISubCategory | null,
    public question?: IQuestion | null,
    public sessionStatuses?: IScenarioStatusEvent[] | null,
    public session?: ISession | null
  ) {
    this.repeatable = this.repeatable ?? false;
    this.positivity = this.positivity ?? false;
    this.vividness = this.vividness ?? false;
  }
}

export function getScenarioIdentifier(scenario: IScenario): number | undefined {
  return scenario.id;
}
