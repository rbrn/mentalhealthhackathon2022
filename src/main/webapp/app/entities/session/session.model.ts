import dayjs from 'dayjs/esm';

export interface ISession {
  id?: number;
  order?: number;
  percentageResolved?: number;
  name?: string;
  sessionNumber?: number;
  createdDate?: dayjs.Dayjs | null;
}

export class Session implements ISession {
  constructor(
    public id?: number,
    public order?: number,
    public percentageResolved?: number,
    public name?: string,
    public sessionNumber?: number,
    public createdDate?: dayjs.Dayjs | null
  ) {}
}

export function getSessionIdentifier(session: ISession): number | undefined {
  return session.id;
}
