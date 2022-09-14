import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScenario, Scenario } from '../scenario.model';
import { ScenarioService } from '../service/scenario.service';

@Injectable({ providedIn: 'root' })
export class ScenarioRoutingResolveService implements Resolve<IScenario> {
  constructor(protected service: ScenarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IScenario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((scenario: HttpResponse<Scenario>) => {
          if (scenario.body) {
            return of(scenario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Scenario());
  }
}
