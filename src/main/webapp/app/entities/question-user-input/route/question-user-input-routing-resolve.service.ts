import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuestionUserInput, QuestionUserInput } from '../question-user-input.model';
import { QuestionUserInputService } from '../service/question-user-input.service';

@Injectable({ providedIn: 'root' })
export class QuestionUserInputRoutingResolveService implements Resolve<IQuestionUserInput> {
  constructor(protected service: QuestionUserInputService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuestionUserInput> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((questionUserInput: HttpResponse<QuestionUserInput>) => {
          if (questionUserInput.body) {
            return of(questionUserInput.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new QuestionUserInput());
  }
}
