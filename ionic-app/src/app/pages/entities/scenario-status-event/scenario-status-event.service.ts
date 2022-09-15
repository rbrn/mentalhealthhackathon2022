import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { createRequestOption } from '../../../shared';
import { ScenarioStatusEvent } from './scenario-status-event.model';

@Injectable({ providedIn: 'root' })
export class ScenarioStatusEventService {
  private resourceUrl = ApiService.API_URL + '/scenario-status-events';

  constructor(protected http: HttpClient) {}

  create(scenarioStatusEvent: ScenarioStatusEvent): Observable<HttpResponse<ScenarioStatusEvent>> {
    return this.http.post<ScenarioStatusEvent>(this.resourceUrl, scenarioStatusEvent, { observe: 'response' });
  }

  update(scenarioStatusEvent: ScenarioStatusEvent): Observable<HttpResponse<ScenarioStatusEvent>> {
    return this.http.put(`${this.resourceUrl}/${scenarioStatusEvent.id}`, scenarioStatusEvent, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ScenarioStatusEvent>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ScenarioStatusEvent[]>> {
    const options = createRequestOption(req);
    return this.http.get<ScenarioStatusEvent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
