import { IScenario } from 'app/entities/scenario/scenario.model';

export interface IQuestionUserInput {
  id?: number;
  userId?: string | null;
  response?: string | null;
  scenario?: IScenario | null;
}

export class QuestionUserInput implements IQuestionUserInput {
  constructor(public id?: number, public userId?: string | null, public response?: string | null, public scenario?: IScenario | null) {}
}

export function getQuestionUserInputIdentifier(questionUserInput: IQuestionUserInput): number | undefined {
  return questionUserInput.id;
}
