import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISession, Session } from '../session.model';

import { SessionService } from './session.service';

describe('Session Service', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let elemDefault: ISession;
  let expectedResult: ISession | ISession[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      order: 0,
      percentageResolved: 0,
      name: 'AAAAAAA',
      createdDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Session', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Session()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Session', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          order: 1,
          percentageResolved: 1,
          name: 'BBBBBB',
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Session', () => {
      const patchObject = Object.assign(
        {
          order: 1,
          name: 'BBBBBB',
        },
        new Session()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Session', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          order: 1,
          percentageResolved: 1,
          name: 'BBBBBB',
          createdDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Session', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSessionToCollectionIfMissing', () => {
      it('should add a Session to an empty array', () => {
        const session: ISession = { id: 123 };
        expectedResult = service.addSessionToCollectionIfMissing([], session);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(session);
      });

      it('should not add a Session to an array that contains it', () => {
        const session: ISession = { id: 123 };
        const sessionCollection: ISession[] = [
          {
            ...session,
          },
          { id: 456 },
        ];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, session);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Session to an array that doesn't contain it", () => {
        const session: ISession = { id: 123 };
        const sessionCollection: ISession[] = [{ id: 456 }];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, session);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(session);
      });

      it('should add only unique Session to an array', () => {
        const sessionArray: ISession[] = [{ id: 123 }, { id: 456 }, { id: 39019 }];
        const sessionCollection: ISession[] = [{ id: 123 }];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, ...sessionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const session: ISession = { id: 123 };
        const session2: ISession = { id: 456 };
        expectedResult = service.addSessionToCollectionIfMissing([], session, session2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(session);
        expect(expectedResult).toContain(session2);
      });

      it('should accept null and undefined values', () => {
        const session: ISession = { id: 123 };
        expectedResult = service.addSessionToCollectionIfMissing([], null, session, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(session);
      });

      it('should return initial array if no Session is added', () => {
        const sessionCollection: ISession[] = [{ id: 123 }];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, undefined, null);
        expect(expectedResult).toEqual(sessionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
