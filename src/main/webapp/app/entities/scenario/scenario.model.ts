import dayjs from 'dayjs/esm';
import { ISession } from 'app/entities/session/session.model';
import { Category } from 'app/entities/enumerations/category.model';
import { Subcategory } from 'app/entities/enumerations/subcategory.model';

export interface IScenario {
  id?: number;
  order?: string;
  name?: string;
  identifier?: string;
  text?: string;
  audioFileName?: string;
  rntype?: string | null;
  theme?: string | null;
  cathegory?: Category | null;
  subcat?: Subcategory | null;
  scenarioNumber?: string | null;
  trialType?: string | null;
  repeatable?: boolean | null;
  positivity?: boolean | null;
  vividness?: boolean | null;
  createdDate?: dayjs.Dayjs | null;
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
    public rntype?: string | null,
    public theme?: string | null,
    public cathegory?: Category | null,
    public subcat?: Subcategory | null,
    public scenarioNumber?: string | null,
    public trialType?: string | null,
    public repeatable?: boolean | null,
    public positivity?: boolean | null,
    public vividness?: boolean | null,
    public createdDate?: dayjs.Dayjs | null,
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
