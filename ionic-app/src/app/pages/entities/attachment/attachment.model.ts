import { BaseEntity } from 'src/model/base-entity';
import { Ticket } from '../ticket/ticket.model';

export class Attachment implements BaseEntity {
  constructor(public id?: number, public name?: string, public fileContentType?: string, public file?: any, public ticket?: Ticket) {}
}
