import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScenarioStatusEventService } from '../service/scenario-status-event.service';
import { IScenarioStatusEvent, ScenarioStatusEvent } from '../scenario-status-event.model';
import { IScenario } from 'app/entities/scenario/scenario.model';
import { ScenarioService } from 'app/entities/scenario/service/scenario.service';

import { ScenarioStatusEventUpdateComponent } from './scenario-status-event-update.component';

describe('ScenarioStatusEvent Management Update Component', () => {
  let comp: ScenarioStatusEventUpdateComponent;
  let fixture: ComponentFixture<ScenarioStatusEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scenarioStatusEventService: ScenarioStatusEventService;
  let scenarioService: ScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScenarioStatusEventUpdateComponent],
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
      .overrideTemplate(ScenarioStatusEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScenarioStatusEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scenarioStatusEventService = TestBed.inject(ScenarioStatusEventService);
    scenarioService = TestBed.inject(ScenarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Scenario query and add missing value', () => {
      const scenarioStatusEvent: IScenarioStatusEvent = { id: 456 };
      const scenario: IScenario = { id: 84865 };
      scenarioStatusEvent.scenario = scenario;

      const scenarioCollection: IScenario[] = [{ id: 87590 }];
      jest.spyOn(scenarioService, 'query').mockReturnValue(of(new HttpResponse({ body: scenarioCollection })));
      const additionalScenarios = [scenario];
      const expectedCollection: IScenario[] = [...additionalScenarios, ...scenarioCollection];
      jest.spyOn(scenarioService, 'addScenarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ scenarioStatusEvent });
      comp.ngOnInit();

      expect(scenarioService.query).toHaveBeenCalled();
      expect(scenarioService.addScenarioToCollectionIfMissing).toHaveBeenCalledWith(scenarioCollection, ...additionalScenarios);
      expect(comp.scenariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const scenarioStatusEvent: IScenarioStatusEvent = { id: 456 };
      const scenario: IScenario = { id: 48585 };
      scenarioStatusEvent.scenario = scenario;

      activatedRoute.data = of({ scenarioStatusEvent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(scenarioStatusEvent));
      expect(comp.scenariosSharedCollection).toContain(scenario);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ScenarioStatusEvent>>();
      const scenarioStatusEvent = { id: 123 };
      jest.spyOn(scenarioStatusEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scenarioStatusEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scenarioStatusEvent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(scenarioStatusEventService.update).toHaveBeenCalledWith(scenarioStatusEvent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ScenarioStatusEvent>>();
      const scenarioStatusEvent = new ScenarioStatusEvent();
      jest.spyOn(scenarioStatusEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scenarioStatusEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scenarioStatusEvent }));
      saveSubject.complete();

      // THEN
      expect(scenarioStatusEventService.create).toHaveBeenCalledWith(scenarioStatusEvent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ScenarioStatusEvent>>();
      const scenarioStatusEvent = { id: 123 };
      jest.spyOn(scenarioStatusEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scenarioStatusEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scenarioStatusEventService.update).toHaveBeenCalledWith(scenarioStatusEvent);
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
