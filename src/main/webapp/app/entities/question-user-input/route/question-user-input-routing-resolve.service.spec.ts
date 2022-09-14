import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IQuestionUserInput, QuestionUserInput } from '../question-user-input.model';
import { QuestionUserInputService } from '../service/question-user-input.service';

import { QuestionUserInputRoutingResolveService } from './question-user-input-routing-resolve.service';

describe('QuestionUserInput routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: QuestionUserInputRoutingResolveService;
  let service: QuestionUserInputService;
  let resultQuestionUserInput: IQuestionUserInput | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(QuestionUserInputRoutingResolveService);
    service = TestBed.inject(QuestionUserInputService);
    resultQuestionUserInput = undefined;
  });

  describe('resolve', () => {
    it('should return IQuestionUserInput returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionUserInput = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultQuestionUserInput).toEqual({ id: 123 });
    });

    it('should return new IQuestionUserInput if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionUserInput = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultQuestionUserInput).toEqual(new QuestionUserInput());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as QuestionUserInput })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultQuestionUserInput = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultQuestionUserInput).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
