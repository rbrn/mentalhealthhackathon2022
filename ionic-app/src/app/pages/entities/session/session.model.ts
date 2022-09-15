import { BaseEntity } from 'src/model/base-entity';
import { Scenario } from '../scenario/scenario.model';

export class Session implements BaseEntity {
  constructor(
    public id?: number,
    public order?: number,
    public percentageResolved?: number,
    public name?: string,
    public sessionNumber?: number,
    public createdDate?: any,
    public scenarios?: Scenario[]
  ) {}
}
