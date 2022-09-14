import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScenario, getScenarioIdentifier } from '../scenario.model';

export type EntityResponseType = HttpResponse<IScenario>;
export type EntityArrayResponseType = HttpResponse<IScenario[]>;

@Injectable({ providedIn: 'root' })
export class ScenarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/scenarios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(scenario: IScenario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scenario);
    return this.http
      .post<IScenario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(scenario: IScenario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scenario);
    return this.http
      .put<IScenario>(`${this.resourceUrl}/${getScenarioIdentifier(scenario) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(scenario: IScenario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scenario);
    return this.http
      .patch<IScenario>(`${this.resourceUrl}/${getScenarioIdentifier(scenario) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IScenario>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IScenario[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addScenarioToCollectionIfMissing(scenarioCollection: IScenario[], ...scenariosToCheck: (IScenario | null | undefined)[]): IScenario[] {
    const scenarios: IScenario[] = scenariosToCheck.filter(isPresent);
    if (scenarios.length > 0) {
      const scenarioCollectionIdentifiers = scenarioCollection.map(scenarioItem => getScenarioIdentifier(scenarioItem)!);
      const scenariosToAdd = scenarios.filter(scenarioItem => {
        const scenarioIdentifier = getScenarioIdentifier(scenarioItem);
        if (scenarioIdentifier == null || scenarioCollectionIdentifiers.includes(scenarioIdentifier)) {
          return false;
        }
        scenarioCollectionIdentifiers.push(scenarioIdentifier);
        return true;
      });
      return [...scenariosToAdd, ...scenarioCollection];
    }
    return scenarioCollection;
  }

  protected convertDateFromClient(scenario: IScenario): IScenario {
    return Object.assign({}, scenario, {
      createdDate: scenario.createdDate?.isValid() ? scenario.createdDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdDate = res.body.createdDate ? dayjs(res.body.createdDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((scenario: IScenario) => {
        scenario.createdDate = scenario.createdDate ? dayjs(scenario.createdDate) : undefined;
      });
    }
    return res;
  }
}
