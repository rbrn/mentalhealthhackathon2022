import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { SubCategory } from './sub-category.model';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
  private resourceUrl = ApiService.API_URL + '/sub-categories';

  constructor(protected http: HttpClient) {}

  create(subCategory: SubCategory): Observable<HttpResponse<SubCategory>> {
    return this.http.post<SubCategory>(this.resourceUrl, subCategory, { observe: 'response' });
  }

  update(subCategory: SubCategory): Observable<HttpResponse<SubCategory>> {
    return this.http.put(`${this.resourceUrl}/${subCategory.id}`, subCategory, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<SubCategory>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<SubCategory[]>> {
    const options = createRequestOption(req);
    return this.http.get<SubCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
