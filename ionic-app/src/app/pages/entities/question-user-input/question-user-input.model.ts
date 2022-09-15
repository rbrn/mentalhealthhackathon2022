import { BaseEntity } from 'src/model/base-entity';
import { Scenario } from '../scenario/scenario.model';

export class QuestionUserInput implements BaseEntity {
  constructor(public id?: number, public userId?: string, public response?: string, public scenario?: Scenario) {}
}
