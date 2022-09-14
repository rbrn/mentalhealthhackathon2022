import dayjs from 'dayjs/esm';
import { IScenario } from 'app/entities/scenario/scenario.model';

export interface IQuestion {
  id?: number;
  text?: string;
  correctAnswer?: boolean;
  correctAnswerFeedback?: boolean;
  wrongAnswerFeedback?: boolean;
  createdDate?: dayjs.Dayjs | null;
  scenario?: IScenario | null;
}

export class Question implements IQuestion {
  constructor(
    public id?: number,
    public text?: string,
    public correctAnswer?: boolean,
    public correctAnswerFeedback?: boolean,
    public wrongAnswerFeedback?: boolean,
    public createdDate?: dayjs.Dayjs | null,
    public scenario?: IScenario | null
  ) {
    this.correctAnswer = this.correctAnswer ?? false;
    this.correctAnswerFeedback = this.correctAnswerFeedback ?? false;
    this.wrongAnswerFeedback = this.wrongAnswerFeedback ?? false;
  }
}

export function getQuestionIdentifier(question: IQuestion): number | undefined {
  return question.id;
}
