import { BaseEntity } from 'src/model/base-entity';
import { Attachment } from '../attachment/attachment.model';
import { Project } from '../project/project.model';
import { User } from '../../../services/user/user.model';
import { Label } from '../label/label.model';

export const enum Status {
  'OPEN (Open)',
  'WAITING_FOR_RESPONSE (Waiting for Customer Response)',
  'CLOSED (Closed)',
  'DUPLICATE (Duplicate)',
  'IN_PROGRESS (In Progress)',
  'REOPENED (Reopened)',
  'CANNOT_REPRODUCE (Cannot Reproduce)',
  'SOLVED (Solved)',
  'WONT_IMPLEMENT (Won&#39;t Implement)',
  'VERIFIED (Verified)',
}

export const enum Type {
  'BUG (Bug)',
  'FEATURE (Feature)',
}

export const enum Priority {
  'HIGHEST (Highest)',
  'HIGHER (Higher)',
  'HIGH (High)',
  'NORMAL (Normal)',
  'LOW (Low)',
  'LOWER (Lower)',
  'LOWERST (Lowest)',
}

export class Ticket implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public dueDate?: any,
    public date?: any,
    public status?: Status,
    public type?: Type,
    public priority?: Priority,
    public attachments?: Attachment[],
    public project?: Project,
    public assignedTo?: User,
    public reportedBy?: User,
    public labels?: Label[]
  ) {}
}
