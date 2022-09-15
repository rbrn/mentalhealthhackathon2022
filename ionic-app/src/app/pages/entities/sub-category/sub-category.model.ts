import { BaseEntity } from 'src/model/base-entity';

export class SubCategory implements BaseEntity {
  constructor(public id?: number, public name?: string) {}
}
