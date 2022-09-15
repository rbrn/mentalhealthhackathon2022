import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private resourceUrl = ApiService.API_URL + '/categories';

  constructor(protected http: HttpClient) {}

  create(category: Category): Observable<HttpResponse<Category>> {
    return this.http.post<Category>(this.resourceUrl, category, { observe: 'response' });
  }

  update(category: Category): Observable<HttpResponse<Category>> {
    return this.http.put(`${this.resourceUrl}/${category.id}`, category, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Category>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Category[]>> {
    const options = createRequestOption(req);
    return this.http.get<Category[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
