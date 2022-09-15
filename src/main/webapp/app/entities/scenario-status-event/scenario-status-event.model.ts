import { IScenario } from 'app/entities/scenario/scenario.model';
import { ScenarioStatus } from 'app/entities/enumerations/scenario-status.model';

export interface IScenarioStatusEvent {
  id?: number;
  userId?: string | null;
  eventType?: ScenarioStatus | null;
  scenario?: IScenario | null;
}

export class ScenarioStatusEvent implements IScenarioStatusEvent {
  constructor(
    public id?: number,
    public userId?: string | null,
    public eventType?: ScenarioStatus | null,
    public scenario?: IScenario | null
  ) {}
}

export function getScenarioStatusEventIdentifier(scenarioStatusEvent: IScenarioStatusEvent): number | undefined {
  return scenarioStatusEvent.id;
}
