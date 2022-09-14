import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';
import { IScenario } from 'app/entities/scenario/scenario.model';
import { ScenarioService } from 'app/entities/scenario/service/scenario.service';

@Component({
  selector: 'jhi-question-update',
  templateUrl: './question-update.component.html',
})
export class QuestionUpdateComponent implements OnInit {
  isSaving = false;

  scenariosSharedCollection: IScenario[] = [];

  editForm = this.fb.group({
    id: [],
    text: [null, [Validators.required]],
    correctAnswer: [null, [Validators.required]],
    correctAnswerFeedback: [null, [Validators.required]],
    wrongAnswerFeedback: [null, [Validators.required]],
    createdDate: [],
    scenario: [],
  });

  constructor(
    protected questionService: QuestionService,
    protected scenarioService: ScenarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ question }) => {
      if (question.id === undefined) {
        const today = dayjs().startOf('day');
        question.createdDate = today;
      }

      this.updateForm(question);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const question = this.createFromForm();
    if (question.id !== undefined) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  trackScenarioById(_index: number, item: IScenario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestion>>): void {
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

  protected updateForm(question: IQuestion): void {
    this.editForm.patchValue({
      id: question.id,
      text: question.text,
      correctAnswer: question.correctAnswer,
      correctAnswerFeedback: question.correctAnswerFeedback,
      wrongAnswerFeedback: question.wrongAnswerFeedback,
      createdDate: question.createdDate ? question.createdDate.format(DATE_TIME_FORMAT) : null,
      scenario: question.scenario,
    });

    this.scenariosSharedCollection = this.scenarioService.addScenarioToCollectionIfMissing(
      this.scenariosSharedCollection,
      question.scenario
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

  protected createFromForm(): IQuestion {
    return {
      ...new Question(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      correctAnswer: this.editForm.get(['correctAnswer'])!.value,
      correctAnswerFeedback: this.editForm.get(['correctAnswerFeedback'])!.value,
      wrongAnswerFeedback: this.editForm.get(['wrongAnswerFeedback'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      scenario: this.editForm.get(['scenario'])!.value,
    };
  }
}
