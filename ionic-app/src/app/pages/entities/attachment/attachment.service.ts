import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Attachment } from './attachment.model';

@Injectable({ providedIn: 'root' })
export class AttachmentService {
  private resourceUrl = ApiService.API_URL + '/attachments';

  constructor(protected http: HttpClient) {}

  create(attachment: Attachment): Observable<HttpResponse<Attachment>> {
    return this.http.post<Attachment>(this.resourceUrl, attachment, { observe: 'response' });
  }

  update(attachment: Attachment): Observable<HttpResponse<Attachment>> {
    return this.http.put(`${this.resourceUrl}/${attachment.id}`, attachment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Attachment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Attachment[]>> {
    const options = createRequestOption(req);
    return this.http.get<Attachment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
