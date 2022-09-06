import { BaseEntity } from 'src/model/base-entity';
import { Ticket } from '../ticket/ticket.model';

export class Label implements BaseEntity {
  constructor(public id?: number, public label?: string, public tickets?: Ticket[]) {}
}
