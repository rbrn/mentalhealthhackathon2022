import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private resourceUrl = ApiService.API_URL + '/projects';

  constructor(protected http: HttpClient) {}

  create(project: Project): Observable<HttpResponse<Project>> {
    return this.http.post<Project>(this.resourceUrl, project, { observe: 'response' });
  }

  update(project: Project): Observable<HttpResponse<Project>> {
    return this.http.put(`${this.resourceUrl}/${project.id}`, project, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Project>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Project[]>> {
    const options = createRequestOption(req);
    return this.http.get<Project[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
