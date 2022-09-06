import { BaseEntity } from 'src/model/base-entity';

export class Project implements BaseEntity {
  constructor(public id?: number, public name?: string) {}
}
