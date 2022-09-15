import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SubCategoryDetailComponent } from './sub-category-detail.component';

describe('SubCategory Management Detail Component', () => {
  let comp: SubCategoryDetailComponent;
  let fixture: ComponentFixture<SubCategoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ subCategory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SubCategoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SubCategoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load subCategory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.subCategory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
