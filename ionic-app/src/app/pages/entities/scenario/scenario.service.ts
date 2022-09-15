import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { Scenario } from './scenario.model';

@Injectable({ providedIn: 'root' })
export class ScenarioService {
  private resourceUrl = ApiService.API_URL + '/scenarios';

  constructor(protected http: HttpClient) {}

  create(scenario: Scenario): Observable<HttpResponse<Scenario>> {
    return this.http.post<Scenario>(this.resourceUrl, scenario, { observe: 'response' });
  }

  update(scenario: Scenario): Observable<HttpResponse<Scenario>> {
    return this.http.put(`${this.resourceUrl}/${scenario.id}`, scenario, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Scenario>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Scenario[]>> {
    const options = createRequestOption(req);
    return this.http.get<Scenario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
