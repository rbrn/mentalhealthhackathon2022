import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScenarioService } from '../service/scenario.service';
import { IScenario, Scenario } from '../scenario.model';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';

import { ScenarioUpdateComponent } from './scenario-update.component';

describe('Scenario Management Update Component', () => {
  let comp: ScenarioUpdateComponent;
  let fixture: ComponentFixture<ScenarioUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scenarioService: ScenarioService;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScenarioUpdateComponent],
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
      .overrideTemplate(ScenarioUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScenarioUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scenarioService = TestBed.inject(ScenarioService);
    sessionService = TestBed.inject(SessionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Session query and add missing value', () => {
      const scenario: IScenario = { id: 456 };
      const session: ISession = { id: 9311 };
      scenario.session = session;

      const sessionCollection: ISession[] = [{ id: 32304 }];
      jest.spyOn(sessionService, 'query').mockReturnValue(of(new HttpResponse({ body: sessionCollection })));
      const additionalSessions = [session];
      const expectedCollection: ISession[] = [...additionalSessions, ...sessionCollection];
      jest.spyOn(sessionService, 'addSessionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ scenario });
      comp.ngOnInit();

      expect(sessionService.query).toHaveBeenCalled();
      expect(sessionService.addSessionToCollectionIfMissing).toHaveBeenCalledWith(sessionCollection, ...additionalSessions);
      expect(comp.sessionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const scenario: IScenario = { id: 456 };
      const session: ISession = { id: 59966 };
      scenario.session = session;

      activatedRoute.data = of({ scenario });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(scenario));
      expect(comp.sessionsSharedCollection).toContain(session);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Scenario>>();
      const scenario = { id: 123 };
      jest.spyOn(scenarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scenario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scenario }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(scenarioService.update).toHaveBeenCalledWith(scenario);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Scenario>>();
      const scenario = new Scenario();
      jest.spyOn(scenarioService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scenario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scenario }));
      saveSubject.complete();

      // THEN
      expect(scenarioService.create).toHaveBeenCalledWith(scenario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Scenario>>();
      const scenario = { id: 123 };
      jest.spyOn(scenarioService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scenario });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scenarioService.update).toHaveBeenCalledWith(scenario);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackSessionById', () => {
      it('Should return tracked Session primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSessionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
