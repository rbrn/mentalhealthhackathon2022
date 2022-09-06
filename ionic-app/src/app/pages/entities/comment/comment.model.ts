import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Comment implements BaseEntity {
  constructor(
    public id?: number,
    public date?: any,
    public text?: string,
    public parents?: Comment[],
    public login?: User,
    public child?: Comment
  ) {}
}
