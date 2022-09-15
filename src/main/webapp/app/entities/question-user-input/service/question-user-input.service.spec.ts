import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IQuestionUserInput, QuestionUserInput } from '../question-user-input.model';

import { QuestionUserInputService } from './question-user-input.service';

describe('QuestionUserInput Service', () => {
  let service: QuestionUserInputService;
  let httpMock: HttpTestingController;
  let elemDefault: IQuestionUserInput;
  let expectedResult: IQuestionUserInput | IQuestionUserInput[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(QuestionUserInputService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      userId: 'AAAAAAA',
      response: 'AAAAAAA',
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

    it('should create a QuestionUserInput', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new QuestionUserInput()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a QuestionUserInput', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          userId: 'BBBBBB',
          response: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a QuestionUserInput', () => {
      const patchObject = Object.assign({}, new QuestionUserInput());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of QuestionUserInput', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          userId: 'BBBBBB',
          response: 'BBBBBB',
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

    it('should delete a QuestionUserInput', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addQuestionUserInputToCollectionIfMissing', () => {
      it('should add a QuestionUserInput to an empty array', () => {
        const questionUserInput: IQuestionUserInput = { id: 123 };
        expectedResult = service.addQuestionUserInputToCollectionIfMissing([], questionUserInput);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(questionUserInput);
      });

      it('should not add a QuestionUserInput to an array that contains it', () => {
        const questionUserInput: IQuestionUserInput = { id: 123 };
        const questionUserInputCollection: IQuestionUserInput[] = [
          {
            ...questionUserInput,
          },
          { id: 456 },
        ];
        expectedResult = service.addQuestionUserInputToCollectionIfMissing(questionUserInputCollection, questionUserInput);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a QuestionUserInput to an array that doesn't contain it", () => {
        const questionUserInput: IQuestionUserInput = { id: 123 };
        const questionUserInputCollection: IQuestionUserInput[] = [{ id: 456 }];
        expectedResult = service.addQuestionUserInputToCollectionIfMissing(questionUserInputCollection, questionUserInput);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(questionUserInput);
      });

      it('should add only unique QuestionUserInput to an array', () => {
        const questionUserInputArray: IQuestionUserInput[] = [{ id: 123 }, { id: 456 }, { id: 97232 }];
        const questionUserInputCollection: IQuestionUserInput[] = [{ id: 123 }];
        expectedResult = service.addQuestionUserInputToCollectionIfMissing(questionUserInputCollection, ...questionUserInputArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const questionUserInput: IQuestionUserInput = { id: 123 };
        const questionUserInput2: IQuestionUserInput = { id: 456 };
        expectedResult = service.addQuestionUserInputToCollectionIfMissing([], questionUserInput, questionUserInput2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(questionUserInput);
        expect(expectedResult).toContain(questionUserInput2);
      });

      it('should accept null and undefined values', () => {
        const questionUserInput: IQuestionUserInput = { id: 123 };
        expectedResult = service.addQuestionUserInputToCollectionIfMissing([], null, questionUserInput, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(questionUserInput);
      });

      it('should return initial array if no QuestionUserInput is added', () => {
        const questionUserInputCollection: IQuestionUserInput[] = [{ id: 123 }];
        expectedResult = service.addQuestionUserInputToCollectionIfMissing(questionUserInputCollection, undefined, null);
        expect(expectedResult).toEqual(questionUserInputCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
