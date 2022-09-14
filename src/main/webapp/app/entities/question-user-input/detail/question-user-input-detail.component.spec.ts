import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuestionUserInputDetailComponent } from './question-user-input-detail.component';

describe('QuestionUserInput Management Detail Component', () => {
  let comp: QuestionUserInputDetailComponent;
  let fixture: ComponentFixture<QuestionUserInputDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionUserInputDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ questionUserInput: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(QuestionUserInputDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(QuestionUserInputDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load questionUserInput on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.questionUserInput).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
