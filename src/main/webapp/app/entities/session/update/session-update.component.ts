import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISession, Session } from '../session.model';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'jhi-session-update',
  templateUrl: './session-update.component.html',
})
export class SessionUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    order: [null, [Validators.required]],
    percentageResolved: [null, [Validators.required]],
    name: [null, [Validators.required]],
    sessionNumber: [null, [Validators.required]],
    createdDate: [],
  });

  constructor(protected sessionService: SessionService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ session }) => {
      if (session.id === undefined) {
        const today = dayjs().startOf('day');
        session.createdDate = today;
      }

      this.updateForm(session);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const session = this.createFromForm();
    if (session.id !== undefined) {
      this.subscribeToSaveResponse(this.sessionService.update(session));
    } else {
      this.subscribeToSaveResponse(this.sessionService.create(session));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISession>>): void {
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

  protected updateForm(session: ISession): void {
    this.editForm.patchValue({
      id: session.id,
      order: session.order,
      percentageResolved: session.percentageResolved,
      name: session.name,
      sessionNumber: session.sessionNumber,
      createdDate: session.createdDate ? session.createdDate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): ISession {
    return {
      ...new Session(),
      id: this.editForm.get(['id'])!.value,
      order: this.editForm.get(['order'])!.value,
      percentageResolved: this.editForm.get(['percentageResolved'])!.value,
      name: this.editForm.get(['name'])!.value,
      sessionNumber: this.editForm.get(['sessionNumber'])!.value,
      createdDate: this.editForm.get(['createdDate'])!.value
        ? dayjs(this.editForm.get(['createdDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
