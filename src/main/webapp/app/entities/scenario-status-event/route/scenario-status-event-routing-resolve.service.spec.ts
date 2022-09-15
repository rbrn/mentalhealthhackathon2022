import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IScenarioStatusEvent, ScenarioStatusEvent } from '../scenario-status-event.model';
import { ScenarioStatusEventService } from '../service/scenario-status-event.service';

import { ScenarioStatusEventRoutingResolveService } from './scenario-status-event-routing-resolve.service';

describe('ScenarioStatusEvent routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ScenarioStatusEventRoutingResolveService;
  let service: ScenarioStatusEventService;
  let resultScenarioStatusEvent: IScenarioStatusEvent | undefined;

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
    routingResolveService = TestBed.inject(ScenarioStatusEventRoutingResolveService);
    service = TestBed.inject(ScenarioStatusEventService);
    resultScenarioStatusEvent = undefined;
  });

  describe('resolve', () => {
    it('should return IScenarioStatusEvent returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultScenarioStatusEvent = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultScenarioStatusEvent).toEqual({ id: 123 });
    });

    it('should return new IScenarioStatusEvent if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultScenarioStatusEvent = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultScenarioStatusEvent).toEqual(new ScenarioStatusEvent());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ScenarioStatusEvent })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultScenarioStatusEvent = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultScenarioStatusEvent).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
