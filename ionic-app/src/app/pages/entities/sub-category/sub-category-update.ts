import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SubCategory } from './sub-category.model';
import { SubCategoryService } from './sub-category.service';

@Component({
  selector: 'page-sub-category-update',
  templateUrl: 'sub-category-update.html',
})
export class SubCategoryUpdatePage implements OnInit {
  subCategory: SubCategory;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private subCategoryService: SubCategoryService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.subCategory = response.data;
      this.isNew = this.subCategory.id === null || this.subCategory.id === undefined;
      this.updateForm(this.subCategory);
    });
  }

  updateForm(subCategory: SubCategory) {
    this.form.patchValue({
      id: subCategory.id,
      name: subCategory.name,
    });
  }

  save() {
    this.isSaving = true;
    const subCategory = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.subCategoryService.update(subCategory));
    } else {
      this.subscribeToSaveResponse(this.subCategoryService.create(subCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<SubCategory>>) {
    result.subscribe(
      (res: HttpResponse<SubCategory>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `SubCategory ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/sub-category');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  private createFromForm(): SubCategory {
    return {
      ...new SubCategory(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
    };
  }
}
