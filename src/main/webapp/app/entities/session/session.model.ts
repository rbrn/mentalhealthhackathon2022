import dayjs from 'dayjs/esm';
import { IScenario } from 'app/entities/scenario/scenario.model';

export interface ISession {
  id?: number;
  order?: number;
  percentageResolved?: number;
  name?: string;
  sessionNumber?: number;
  createdDate?: dayjs.Dayjs | null;
  scenarios?: IScenario[] | null;
}

export class Session implements ISession {
  constructor(
    public id?: number,
    public order?: number,
    public percentageResolved?: number,
    public name?: string,
    public sessionNumber?: number,
    public createdDate?: dayjs.Dayjs | null,
    public scenarios?: IScenario[] | null
  ) {}
}

export function getSessionIdentifier(session: ISession): number | undefined {
  return session.id;
}
