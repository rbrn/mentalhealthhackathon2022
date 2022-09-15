import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestionUserInput, QuestionUserInput } from '../question-user-input.model';
import { QuestionUserInputService } from '../service/question-user-input.service';
import { IScenario } from 'app/entities/scenario/scenario.model';
import { ScenarioService } from 'app/entities/scenario/service/scenario.service';

@Component({
  selector: 'jhi-question-user-input-update',
  templateUrl: './question-user-input-update.component.html',
})
export class QuestionUserInputUpdateComponent implements OnInit {
  isSaving = false;

  scenariosSharedCollection: IScenario[] = [];

  editForm = this.fb.group({
    id: [],
    userId: [],
    response: [],
    scenario: [],
  });

  constructor(
    protected questionUserInputService: QuestionUserInputService,
    protected scenarioService: ScenarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionUserInput }) => {
      this.updateForm(questionUserInput);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const questionUserInput = this.createFromForm();
    if (questionUserInput.id !== undefined) {
      this.subscribeToSaveResponse(this.questionUserInputService.update(questionUserInput));
    } else {
      this.subscribeToSaveResponse(this.questionUserInputService.create(questionUserInput));
    }
  }

  trackScenarioById(_index: number, item: IScenario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionUserInput>>): void {
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

  protected updateForm(questionUserInput: IQuestionUserInput): void {
    this.editForm.patchValue({
      id: questionUserInput.id,
      userId: questionUserInput.userId,
      response: questionUserInput.response,
      scenario: questionUserInput.scenario,
    });

    this.scenariosSharedCollection = this.scenarioService.addScenarioToCollectionIfMissing(
      this.scenariosSharedCollection,
      questionUserInput.scenario
    );
  }

  protected loadRelationshipsOptions(): void {
    this.scenarioService
      .query()
      .pipe(map((res: HttpResponse<IScenario[]>) => res.body ?? []))
      .pipe(
        map((scenarios: IScenario[]) =>
          this.scenarioService.addScenarioToCollectionIfMissing(scenarios, this.editForm.get('scenario')!.value)
        )
      )
      .subscribe((scenarios: IScenario[]) => (this.scenariosSharedCollection = scenarios));
  }

  protected createFromForm(): IQuestionUserInput {
    return {
      ...new QuestionUserInput(),
      id: this.editForm.get(['id'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      response: this.editForm.get(['response'])!.value,
      scenario: this.editForm.get(['scenario'])!.value,
    };
  }
}
