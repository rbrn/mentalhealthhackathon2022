import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IScenario, Scenario } from '../scenario.model';
import { ScenarioService } from '../service/scenario.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { ISubCategory } from 'app/entities/sub-category/sub-category.model';
import { SubCategoryService } from 'app/entities/sub-category/service/sub-category.service';
import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';
import { RntType } from 'app/entities/enumerations/rnt-type.model';
import { Theme } from 'app/entities/enumerations/theme.model';
import { TrialType } from 'app/entities/enumerations/trial-type.model';

@Component({
  selector: 'jhi-scenario-update',
  templateUrl: './scenario-update.component.html',
})
export class ScenarioUpdateComponent implements OnInit {
  isSaving = false;
  rntTypeValues = Object.keys(RntType);
  themeValues = Object.keys(Theme);
  trialTypeValues = Object.keys(TrialType);

  categoriesCollection: ICategory[] = [];
  subcategoriesCollection: ISubCategory[] = [];
  sessionsSharedCollection: ISession[] = [];

  editForm = this.fb.group({
    id: [],
    order: [null, [Validators.required]],
    name: [null, [Validators.required]],
    identifier: [null, [Validators.required]],
    text: [null, [Validators.required]],
    audioFileName: [null, [Validators.required]],
    rntype: [],
    theme: [],
    scenarioNumber: [],
    trialType: [],
    repeatable: [],
    positivity: [],
    vividness: [],
    createdDate: [],
    category: [],
    subcategory: [],
    session: [],
  });

  constructor(
    protected scenarioService: ScenarioService,
    protected categoryService: CategoryService,
    protected subCategoryService: SubCategoryService,
    protected sessionService: SessionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scenario }) => {
      if (scenario.id === undefined) {
        const today = dayjs().startOf('day');
        scenario.createdDate = today;
      }

      this.updateForm(scenario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const scenario = this.createFromForm();
    if (scenario.id !== undefined) {
      this.subscribeToSaveResponse(this.scenarioService.update(scenario));
    } else {
      this.subscribeToSaveResponse(this.scenarioService.create(scenario));
    }
  }

  trackCategoryById(_index: number, item: ICategory): number {
    return item.id!;
  }

  trackSubCategoryById(_index: number, item: ISubCategory): number {
    return item.id!;
  }

  trackSessionById(_index: number, item: ISession): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScenario>>): void {
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

  protected updateForm(scenario: IScenario): void {
    this.editForm.patchValue({
      id: scenario.id,
      order: scenario.order,
      name: scenario.name,
      identifier: scenario.identifier,
      text: scenario.text,
      audioFileName: scenario.audioFileName,
      rntype: scenario.rntype,
      theme: scenario.theme,
      scenarioNumber: scenario.scenarioNumber,
      trialType: scenario.trialType,
      repeatable: scenario.repeatable,
      positivity: scenario.positivity,
      vividness: scenario.vividness,
      createdDate: scenario.createdDate ? scenario.createdDate.format(DATE_TIME_FORMAT) : null,
      category: scenario.category,
      subcategory: scenario.subcategory,
      session: scenario.session,
    });

    this.categoriesCollection = this.categoryService.addCategoryToCollectionIfMissing(this.categoriesCollection, scenario.category);
    this.subcategoriesCollection = this.subCategoryService.addSubCategoryToCollectionIfMissing(
      this.subcategoriesCollection,
      scenario.subcategory
    );
    this.sessionsSharedCollection = this.sessionService.addSessionToCollectionIfMissing(this.sessionsSharedCollection, scenario.session);
  }

  protected loadRelationshipsOptions(): void {
    this.categoryService
      .query({ filter: 'scenario-is-null' })
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesCollection = categories));

    this.subCategoryService
      .query({ filter: 'scenario-is-null' })
      .pipe(map((res: HttpResponse<ISubCategory[]>) => res.body ?? []))
      .pipe(
        map((subCategories: ISubCategory[]) =>
          this.subCategoryService.addSubCategoryToCollectionIfMissing(subCategories, this.editForm.get('subcategory')!.value)
        )
      )
      .subscribe((subCategories: ISubCategory[]) => (this.subcategoriesCollection = subCategories));

    this.sessionService
      .query()
      .pipe(map((res: HttpResponse<ISession[]>) => res.body ?? []))
      .pipe(
        map((sessions: ISession[]) => this.sessionService.addSessionToCollectionIfMissing(sessions, this.editForm.get('session')!.value))
      )
      .subscribe((sessions: ISession[]) => (this.sessionsSharedCollection = sessions));
  }

  protected createFromForm(): IScenario {
    return {
      ...new Scenario(),
      id: this.editForm.get(['id'])!.value,
      order: this.editForm.get(['order'])!.value,
      name: this.editForm.get(['name'])!.value,
      identifier: this.editForm.get(['identifier'])!.value,
      text: this.editForm.get(['text'])!.value,
      audioFileName: this.editForm.get(['audioFileName'])!.value,
      rntype: this.editForm.get(['rntype'])!.value,
      theme: this.editForm.get(['theme'])!.value,
      scenarioNumber: this.editForm.get(['scenarioNumber'])!.value,
      trialType: this.editForm.get(['trialType'])!.value,
      repeatable: this.editForm.get(['repeatable'])!.value,
      positivity: this.editForm.get(['positivity'])!.value,
      vividness: this.editForm.get(['vividness'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      category: this.editForm.get(['category'])!.value,
      subcategory: this.editForm.get(['subcategory'])!.value,
      session: this.editForm.get(['session'])!.value,
    };
  }
}
