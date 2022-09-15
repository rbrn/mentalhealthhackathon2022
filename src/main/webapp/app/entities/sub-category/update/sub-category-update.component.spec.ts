import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SubCategoryService } from '../service/sub-category.service';
import { ISubCategory, SubCategory } from '../sub-category.model';

import { SubCategoryUpdateComponent } from './sub-category-update.component';

describe('SubCategory Management Update Component', () => {
  let comp: SubCategoryUpdateComponent;
  let fixture: ComponentFixture<SubCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subCategoryService: SubCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SubCategoryUpdateComponent],
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
      .overrideTemplate(SubCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subCategoryService = TestBed.inject(SubCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const subCategory: ISubCategory = { id: 456 };

      activatedRoute.data = of({ subCategory });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(subCategory));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SubCategory>>();
      const subCategory = { id: 123 };
      jest.spyOn(subCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subCategory }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(subCategoryService.update).toHaveBeenCalledWith(subCategory);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SubCategory>>();
      const subCategory = new SubCategory();
      jest.spyOn(subCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subCategory }));
      saveSubject.complete();

      // THEN
      expect(subCategoryService.create).toHaveBeenCalledWith(subCategory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SubCategory>>();
      const subCategory = { id: 123 };
      jest.spyOn(subCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subCategoryService.update).toHaveBeenCalledWith(subCategory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
