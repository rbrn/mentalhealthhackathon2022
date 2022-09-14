import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISession, getSessionIdentifier } from '../session.model';

export type EntityResponseType = HttpResponse<ISession>;
export type EntityArrayResponseType = HttpResponse<ISession[]>;

@Injectable({ providedIn: 'root' })
export class SessionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sessions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(session: ISession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(session);
    return this.http
      .post<ISession>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(session: ISession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(session);
    return this.http
      .put<ISession>(`${this.resourceUrl}/${getSessionIdentifier(session) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(session: ISession): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(session);
    return this.http
      .patch<ISession>(`${this.resourceUrl}/${getSessionIdentifier(session) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISession>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISession[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSessionToCollectionIfMissing(sessionCollection: ISession[], ...sessionsToCheck: (ISession | null | undefined)[]): ISession[] {
    const sessions: ISession[] = sessionsToCheck.filter(isPresent);
    if (sessions.length > 0) {
      const sessionCollectionIdentifiers = sessionCollection.map(sessionItem => getSessionIdentifier(sessionItem)!);
      const sessionsToAdd = sessions.filter(sessionItem => {
        const sessionIdentifier = getSessionIdentifier(sessionItem);
        if (sessionIdentifier == null || sessionCollectionIdentifiers.includes(sessionIdentifier)) {
          return false;
        }
        sessionCollectionIdentifiers.push(sessionIdentifier);
        return true;
      });
      return [...sessionsToAdd, ...sessionCollection];
    }
    return sessionCollection;
  }

  protected convertDateFromClient(session: ISession): ISession {
    return Object.assign({}, session, {
      createdDate: session.createdDate?.isValid() ? session.createdDate.toJSON() : undefined,
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
      res.body.forEach((session: ISession) => {
        session.createdDate = session.createdDate ? dayjs(session.createdDate) : undefined;
      });
    }
    return res;
  }
}
