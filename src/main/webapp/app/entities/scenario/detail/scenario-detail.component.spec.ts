import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ScenarioDetailComponent } from './scenario-detail.component';

describe('Scenario Management Detail Component', () => {
  let comp: ScenarioDetailComponent;
  let fixture: ComponentFixture<ScenarioDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ scenario: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ScenarioDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ScenarioDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load scenario on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.scenario).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
