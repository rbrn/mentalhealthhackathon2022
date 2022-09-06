import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Comment } from './comment.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private resourceUrl = ApiService.API_URL + '/comments';

  constructor(protected http: HttpClient) {}

  create(comment: Comment): Observable<HttpResponse<Comment>> {
    return this.http.post<Comment>(this.resourceUrl, comment, { observe: 'response' });
  }

  update(comment: Comment): Observable<HttpResponse<Comment>> {
    return this.http.put(`${this.resourceUrl}/${comment.id}`, comment, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Comment>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Comment[]>> {
    const options = createRequestOption(req);
    return this.http.get<Comment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
