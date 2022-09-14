import { BaseEntity } from 'src/model/base-entity';
import { Scenario } from '../scenario/scenario.model';

export class Question implements BaseEntity {
  constructor(
    public id?: number,
    public text?: string,
    public correctAnswer?: boolean,
    public correctAnswerFeedback?: boolean,
    public wrongAnswerFeedback?: boolean,
    public createdDate?: any,
    public scenario?: Scenario
  ) {
    this.correctAnswer = false;
    this.correctAnswerFeedback = false;
    this.wrongAnswerFeedback = false;
  }
}
