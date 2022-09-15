import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScenarioStatusEvent, ScenarioStatusEvent } from '../scenario-status-event.model';
import { ScenarioStatusEventService } from '../service/scenario-status-event.service';

@Injectable({ providedIn: 'root' })
export class ScenarioStatusEventRoutingResolveService implements Resolve<IScenarioStatusEvent> {
  constructor(protected service: ScenarioStatusEventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IScenarioStatusEvent> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((scenarioStatusEvent: HttpResponse<ScenarioStatusEvent>) => {
          if (scenarioStatusEvent.body) {
            return of(scenarioStatusEvent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ScenarioStatusEvent());
  }
}
