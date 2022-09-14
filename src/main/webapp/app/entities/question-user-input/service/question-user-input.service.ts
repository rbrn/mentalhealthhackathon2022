import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuestionUserInput, getQuestionUserInputIdentifier } from '../question-user-input.model';

export type EntityResponseType = HttpResponse<IQuestionUserInput>;
export type EntityArrayResponseType = HttpResponse<IQuestionUserInput[]>;

@Injectable({ providedIn: 'root' })
export class QuestionUserInputService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/question-user-inputs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(questionUserInput: IQuestionUserInput): Observable<EntityResponseType> {
    return this.http.post<IQuestionUserInput>(this.resourceUrl, questionUserInput, { observe: 'response' });
  }

  update(questionUserInput: IQuestionUserInput): Observable<EntityResponseType> {
    return this.http.put<IQuestionUserInput>(
      `${this.resourceUrl}/${getQuestionUserInputIdentifier(questionUserInput) as number}`,
      questionUserInput,
      { observe: 'response' }
    );
  }

  partialUpdate(questionUserInput: IQuestionUserInput): Observable<EntityResponseType> {
    return this.http.patch<IQuestionUserInput>(
      `${this.resourceUrl}/${getQuestionUserInputIdentifier(questionUserInput) as number}`,
      questionUserInput,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionUserInput>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuestionUserInput[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addQuestionUserInputToCollectionIfMissing(
    questionUserInputCollection: IQuestionUserInput[],
    ...questionUserInputsToCheck: (IQuestionUserInput | null | undefined)[]
  ): IQuestionUserInput[] {
    const questionUserInputs: IQuestionUserInput[] = questionUserInputsToCheck.filter(isPresent);
    if (questionUserInputs.length > 0) {
      const questionUserInputCollectionIdentifiers = questionUserInputCollection.map(
        questionUserInputItem => getQuestionUserInputIdentifier(questionUserInputItem)!
      );
      const questionUserInputsToAdd = questionUserInputs.filter(questionUserInputItem => {
        const questionUserInputIdentifier = getQuestionUserInputIdentifier(questionUserInputItem);
        if (questionUserInputIdentifier == null || questionUserInputCollectionIdentifiers.includes(questionUserInputIdentifier)) {
          return false;
        }
        questionUserInputCollectionIdentifiers.push(questionUserInputIdentifier);
        return true;
      });
      return [...questionUserInputsToAdd, ...questionUserInputCollection];
    }
    return questionUserInputCollection;
  }
}
