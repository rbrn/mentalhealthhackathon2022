import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScenarioStatusEvent, getScenarioStatusEventIdentifier } from '../scenario-status-event.model';

export type EntityResponseType = HttpResponse<IScenarioStatusEvent>;
export type EntityArrayResponseType = HttpResponse<IScenarioStatusEvent[]>;

@Injectable({ providedIn: 'root' })
export class ScenarioStatusEventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/scenario-status-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(scenarioStatusEvent: IScenarioStatusEvent): Observable<EntityResponseType> {
    return this.http.post<IScenarioStatusEvent>(this.resourceUrl, scenarioStatusEvent, { observe: 'response' });
  }

  update(scenarioStatusEvent: IScenarioStatusEvent): Observable<EntityResponseType> {
    return this.http.put<IScenarioStatusEvent>(
      `${this.resourceUrl}/${getScenarioStatusEventIdentifier(scenarioStatusEvent) as number}`,
      scenarioStatusEvent,
      { observe: 'response' }
    );
  }

  partialUpdate(scenarioStatusEvent: IScenarioStatusEvent): Observable<EntityResponseType> {
    return this.http.patch<IScenarioStatusEvent>(
      `${this.resourceUrl}/${getScenarioStatusEventIdentifier(scenarioStatusEvent) as number}`,
      scenarioStatusEvent,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IScenarioStatusEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IScenarioStatusEvent[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addScenarioStatusEventToCollectionIfMissing(
    scenarioStatusEventCollection: IScenarioStatusEvent[],
    ...scenarioStatusEventsToCheck: (IScenarioStatusEvent | null | undefined)[]
  ): IScenarioStatusEvent[] {
    const scenarioStatusEvents: IScenarioStatusEvent[] = scenarioStatusEventsToCheck.filter(isPresent);
    if (scenarioStatusEvents.length > 0) {
      const scenarioStatusEventCollectionIdentifiers = scenarioStatusEventCollection.map(
        scenarioStatusEventItem => getScenarioStatusEventIdentifier(scenarioStatusEventItem)!
      );
      const scenarioStatusEventsToAdd = scenarioStatusEvents.filter(scenarioStatusEventItem => {
        const scenarioStatusEventIdentifier = getScenarioStatusEventIdentifier(scenarioStatusEventItem);
        if (scenarioStatusEventIdentifier == null || scenarioStatusEventCollectionIdentifiers.includes(scenarioStatusEventIdentifier)) {
          return false;
        }
        scenarioStatusEventCollectionIdentifiers.push(scenarioStatusEventIdentifier);
        return true;
      });
      return [...scenarioStatusEventsToAdd, ...scenarioStatusEventCollection];
    }
    return scenarioStatusEventCollection;
  }
}
