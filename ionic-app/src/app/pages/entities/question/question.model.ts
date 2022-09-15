import { BaseEntity } from 'src/model/base-entity';

export class Question implements BaseEntity {
  constructor(
    public id?: number,
    public title?: string,
    public text?: string,
    public correctAnswer?: boolean,
    public correctAnswerFeedback?: boolean,
    public wrongAnswerFeedback?: boolean,
    public createdDate?: any
  ) {
    this.correctAnswer = false;
    this.correctAnswerFeedback = false;
    this.wrongAnswerFeedback = false;
  }
}
