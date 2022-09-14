import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Question } from './question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private resourceUrl = ApiService.API_URL + '/questions';

  constructor(protected http: HttpClient) {}

  create(question: Question): Observable<HttpResponse<Question>> {
    return this.http.post<Question>(this.resourceUrl, question, { observe: 'response' });
  }

  update(question: Question): Observable<HttpResponse<Question>> {
    return this.http.put(`${this.resourceUrl}/${question.id}`, question, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Question>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Question[]>> {
    const options = createRequestOption(req);
    return this.http.get<Question[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
