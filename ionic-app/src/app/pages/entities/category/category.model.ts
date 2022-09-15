import { BaseEntity } from 'src/model/base-entity';

export class Category implements BaseEntity {
  constructor(public id?: number, public name?: string) {}
}
