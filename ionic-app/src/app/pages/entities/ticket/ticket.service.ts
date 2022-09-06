import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Ticket } from './ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private resourceUrl = ApiService.API_URL + '/tickets';

  constructor(protected http: HttpClient) {}

  create(ticket: Ticket): Observable<HttpResponse<Ticket>> {
    return this.http.post<Ticket>(this.resourceUrl, ticket, { observe: 'response' });
  }

  update(ticket: Ticket): Observable<HttpResponse<Ticket>> {
    return this.http.put(`${this.resourceUrl}/${ticket.id}`, ticket, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Ticket>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Ticket[]>> {
    const options = createRequestOption(req);
    return this.http.get<Ticket[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
