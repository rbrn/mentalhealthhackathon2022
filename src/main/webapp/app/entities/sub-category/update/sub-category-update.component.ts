import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISubCategory, SubCategory } from '../sub-category.model';
import { SubCategoryService } from '../service/sub-category.service';

@Component({
  selector: 'jhi-sub-category-update',
  templateUrl: './sub-category-update.component.html',
})
export class SubCategoryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected subCategoryService: SubCategoryService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subCategory }) => {
      this.updateForm(subCategory);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subCategory = this.createFromForm();
    if (subCategory.id !== undefined) {
      this.subscribeToSaveResponse(this.subCategoryService.update(subCategory));
    } else {
      this.subscribeToSaveResponse(this.subCategoryService.create(subCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubCategory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(subCategory: ISubCategory): void {
    this.editForm.patchValue({
      id: subCategory.id,
      name: subCategory.name,
    });
  }

  protected createFromForm(): ISubCategory {
    return {
      ...new SubCategory(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
