import { BaseEntity } from 'src/model/base-entity';
import { Scenario } from '../scenario/scenario.model';

export const enum ScenarioStatus {
  'START (Start)',
  'END (End)',
}

export class ScenarioStatusEvent implements BaseEntity {
  constructor(public id?: number, public userId?: string, public eventType?: ScenarioStatus, public scenario?: Scenario) {}
}
