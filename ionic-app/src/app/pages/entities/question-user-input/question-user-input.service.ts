import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { QuestionUserInput } from './question-user-input.model';

@Injectable({ providedIn: 'root' })
export class QuestionUserInputService {
  private resourceUrl = ApiService.API_URL + '/question-user-inputs';

  constructor(protected http: HttpClient) {}

  create(questionUserInput: QuestionUserInput): Observable<HttpResponse<QuestionUserInput>> {
    return this.http.post<QuestionUserInput>(this.resourceUrl, questionUserInput, { observe: 'response' });
  }

  update(questionUserInput: QuestionUserInput): Observable<HttpResponse<QuestionUserInput>> {
    return this.http.put(`${this.resourceUrl}/${questionUserInput.id}`, questionUserInput, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<QuestionUserInput>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<QuestionUserInput[]>> {
    const options = createRequestOption(req);
    return this.http.get<QuestionUserInput[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
