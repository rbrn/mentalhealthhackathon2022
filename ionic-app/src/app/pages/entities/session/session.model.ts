import { BaseEntity } from 'src/model/base-entity';

export class Session implements BaseEntity {
  constructor(
    public id?: number,
    public order?: number,
    public percentageResolved?: number,
    public name?: string,
    public createdDate?: any
  ) {}
}
