import dayjs from 'dayjs/esm';

export interface IQuestion {
  id?: number;
  title?: string;
  text?: string;
  correctAnswer?: boolean;
  correctAnswerFeedback?: boolean;
  wrongAnswerFeedback?: boolean;
  createdDate?: dayjs.Dayjs | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public title?: string,
    public text?: string,
    public correctAnswer?: boolean,
    public correctAnswerFeedback?: boolean,
    public wrongAnswerFeedback?: boolean,
    public createdDate?: dayjs.Dayjs | null
  ) {
    this.correctAnswer = this.correctAnswer ?? false;
    this.correctAnswerFeedback = this.correctAnswerFeedback ?? false;
    this.wrongAnswerFeedback = this.wrongAnswerFeedback ?? false;
  }
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}
