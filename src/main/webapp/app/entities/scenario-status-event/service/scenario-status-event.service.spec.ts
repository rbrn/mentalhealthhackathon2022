import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ScenarioStatus } from 'app/entities/enumerations/scenario-status.model';
import { IScenarioStatusEvent, ScenarioStatusEvent } from '../scenario-status-event.model';

import { ScenarioStatusEventService } from './scenario-status-event.service';

describe('ScenarioStatusEvent Service', () => {
  let service: ScenarioStatusEventService;
  let httpMock: HttpTestingController;
  let elemDefault: IScenarioStatusEvent;
  let expectedResult: IScenarioStatusEvent | IScenarioStatusEvent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ScenarioStatusEventService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      userId: 'AAAAAAA',
      eventType: ScenarioStatus.START,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ScenarioStatusEvent', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ScenarioStatusEvent()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ScenarioStatusEvent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          userId: 'BBBBBB',
          eventType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ScenarioStatusEvent', () => {
      const patchObject = Object.assign(
        {
          userId: 'BBBBBB',
        },
        new ScenarioStatusEvent()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ScenarioStatusEvent', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          userId: 'BBBBBB',
          eventType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ScenarioStatusEvent', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addScenarioStatusEventToCollectionIfMissing', () => {
      it('should add a ScenarioStatusEvent to an empty array', () => {
        const scenarioStatusEvent: IScenarioStatusEvent = { id: 123 };
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing([], scenarioStatusEvent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scenarioStatusEvent);
      });

      it('should not add a ScenarioStatusEvent to an array that contains it', () => {
        const scenarioStatusEvent: IScenarioStatusEvent = { id: 123 };
        const scenarioStatusEventCollection: IScenarioStatusEvent[] = [
          {
            ...scenarioStatusEvent,
          },
          { id: 456 },
        ];
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing(scenarioStatusEventCollection, scenarioStatusEvent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ScenarioStatusEvent to an array that doesn't contain it", () => {
        const scenarioStatusEvent: IScenarioStatusEvent = { id: 123 };
        const scenarioStatusEventCollection: IScenarioStatusEvent[] = [{ id: 456 }];
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing(scenarioStatusEventCollection, scenarioStatusEvent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scenarioStatusEvent);
      });

      it('should add only unique ScenarioStatusEvent to an array', () => {
        const scenarioStatusEventArray: IScenarioStatusEvent[] = [{ id: 123 }, { id: 456 }, { id: 67116 }];
        const scenarioStatusEventCollection: IScenarioStatusEvent[] = [{ id: 123 }];
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing(scenarioStatusEventCollection, ...scenarioStatusEventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const scenarioStatusEvent: IScenarioStatusEvent = { id: 123 };
        const scenarioStatusEvent2: IScenarioStatusEvent = { id: 456 };
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing([], scenarioStatusEvent, scenarioStatusEvent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scenarioStatusEvent);
        expect(expectedResult).toContain(scenarioStatusEvent2);
      });

      it('should accept null and undefined values', () => {
        const scenarioStatusEvent: IScenarioStatusEvent = { id: 123 };
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing([], null, scenarioStatusEvent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scenarioStatusEvent);
      });

      it('should return initial array if no ScenarioStatusEvent is added', () => {
        const scenarioStatusEventCollection: IScenarioStatusEvent[] = [{ id: 123 }];
        expectedResult = service.addScenarioStatusEventToCollectionIfMissing(scenarioStatusEventCollection, undefined, null);
        expect(expectedResult).toEqual(scenarioStatusEventCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
