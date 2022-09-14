import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { QuestionUserInputService } from '../service/question-user-input.service';
import { IQuestionUserInput, QuestionUserInput } from '../question-user-input.model';
import { IScenario } from 'app/entities/scenario/scenario.model';
import { ScenarioService } from 'app/entities/scenario/service/scenario.service';

import { QuestionUserInputUpdateComponent } from './question-user-input-update.component';

describe('QuestionUserInput Management Update Component', () => {
  let comp: QuestionUserInputUpdateComponent;
  let fixture: ComponentFixture<QuestionUserInputUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let questionUserInputService: QuestionUserInputService;
  let scenarioService: ScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [QuestionUserInputUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(QuestionUserInputUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(QuestionUserInputUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    questionUserInputService = TestBed.inject(QuestionUserInputService);
    scenarioService = TestBed.inject(ScenarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Scenario query and add missing value', () => {
      const questionUserInput: IQuestionUserInput = { id: 456 };
      const scenario: IScenario = { id: 66241 };
      questionUserInput.scenario = scenario;

      const scenarioCollection: IScenario[] = [{ id: 40601 }];
      jest.spyOn(scenarioService, 'query').mockReturnValue(of(new HttpResponse({ body: scenarioCollection })));
      const additionalScenarios = [scenario];
      const expectedCollection: IScenario[] = [...additionalScenarios, ...scenarioCollection];
      jest.spyOn(scenarioService, 'addScenarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ questionUserInput });
      comp.ngOnInit();

      expect(scenarioService.query).toHaveBeenCalled();
      expect(scenarioService.addScenarioToCollectionIfMissing).toHaveBeenCalledWith(scenarioCollection, ...additionalScenarios);
      expect(comp.scenariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const questionUserInput: IQuestionUserInput = { id: 456 };
      const scenario: IScenario = { id: 77047 };
      questionUserInput.scenario = scenario;

      activatedRoute.data = of({ questionUserInput });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(questionUserInput));
      expect(comp.scenariosSharedCollection).toContain(scenario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionUserInput>>();
      const questionUserInput = { id: 123 };
      jest.spyOn(questionUserInputService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionUserInput });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionUserInput }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(questionUserInputService.update).toHaveBeenCalledWith(questionUserInput);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionUserInput>>();
      const questionUserInput = new QuestionUserInput();
      jest.spyOn(questionUserInputService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionUserInput });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: questionUserInput }));
      saveSubject.complete();

      // THEN
      expect(questionUserInputService.create).toHaveBeenCalledWith(questionUserInput);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<QuestionUserInput>>();
      const questionUserInput = { id: 123 };
      jest.spyOn(questionUserInputService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ questionUserInput });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(questionUserInputService.update).toHaveBeenCalledWith(questionUserInput);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackScenarioById', () => {
      it('Should return tracked Scenario primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackScenarioById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
