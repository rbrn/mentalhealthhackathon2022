import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ScenarioStatusEventDetailComponent } from './scenario-status-event-detail.component';

describe('ScenarioStatusEvent Management Detail Component', () => {
  let comp: ScenarioStatusEventDetailComponent;
  let fixture: ComponentFixture<ScenarioStatusEventDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioStatusEventDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ scenarioStatusEvent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ScenarioStatusEventDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ScenarioStatusEventDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load scenarioStatusEvent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.scenarioStatusEvent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
