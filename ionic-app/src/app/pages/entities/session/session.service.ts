import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Session } from './session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private resourceUrl = ApiService.API_URL + '/sessions';

  constructor(protected http: HttpClient) {}

  create(session: Session): Observable<HttpResponse<Session>> {
    return this.http.post<Session>(this.resourceUrl, session, { observe: 'response' });
  }

  update(session: Session): Observable<HttpResponse<Session>> {
    return this.http.put(`${this.resourceUrl}/${session.id}`, session, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Session>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Session[]>> {
    const options = createRequestOption(req);
    return this.http.get<Session[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
