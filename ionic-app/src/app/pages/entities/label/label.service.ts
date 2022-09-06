import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Label } from './label.model';

@Injectable({ providedIn: 'root' })
export class LabelService {
  private resourceUrl = ApiService.API_URL + '/labels';

  constructor(protected http: HttpClient) {}

  create(label: Label): Observable<HttpResponse<Label>> {
    return this.http.post<Label>(this.resourceUrl, label, { observe: 'response' });
  }

  update(label: Label): Observable<HttpResponse<Label>> {
    return this.http.put(`${this.resourceUrl}/${label.id}`, label, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Label>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Label[]>> {
    const options = createRequestOption(req);
    return this.http.get<Label[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
