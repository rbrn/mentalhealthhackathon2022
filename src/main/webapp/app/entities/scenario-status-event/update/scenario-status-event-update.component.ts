import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IScenarioStatusEvent, ScenarioStatusEvent } from '../scenario-status-event.model';
import { ScenarioStatusEventService } from '../service/scenario-status-event.service';
import { IScenario } from 'app/entities/scenario/scenario.model';
import { ScenarioService } from 'app/entities/scenario/service/scenario.service';
import { ScenarioStatus } from 'app/entities/enumerations/scenario-status.model';

@Component({
  selector: 'jhi-scenario-status-event-update',
  templateUrl: './scenario-status-event-update.component.html',
})
export class ScenarioStatusEventUpdateComponent implements OnInit {
  isSaving = false;
  scenarioStatusValues = Object.keys(ScenarioStatus);

  scenariosSharedCollection: IScenario[] = [];

  editForm = this.fb.group({
    id: [],
    userId: [],
    eventType: [],
    scenario: [],
  });

  constructor(
    protected scenarioStatusEventService: ScenarioStatusEventService,
    protected scenarioService: ScenarioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scenarioStatusEvent }) => {
      this.updateForm(scenarioStatusEvent);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const scenarioStatusEvent = this.createFromForm();
    if (scenarioStatusEvent.id !== undefined) {
      this.subscribeToSaveResponse(this.scenarioStatusEventService.update(scenarioStatusEvent));
    } else {
      this.subscribeToSaveResponse(this.scenarioStatusEventService.create(scenarioStatusEvent));
    }
  }

  trackScenarioById(_index: number, item: IScenario): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScenarioStatusEvent>>): void {
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

  protected updateForm(scenarioStatusEvent: IScenarioStatusEvent): void {
    this.editForm.patchValue({
      id: scenarioStatusEvent.id,
      userId: scenarioStatusEvent.userId,
      eventType: scenarioStatusEvent.eventType,
      scenario: scenarioStatusEvent.scenario,
    });

    this.scenariosSharedCollection = this.scenarioService.addScenarioToCollectionIfMissing(
      this.scenariosSharedCollection,
      scenarioStatusEvent.scenario
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

  protected createFromForm(): IScenarioStatusEvent {
    return {
      ...new ScenarioStatusEvent(),
      id: this.editForm.get(['id'])!.value,
      userId: this.editForm.get(['userId'])!.value,
      eventType: this.editForm.get(['eventType'])!.value,
      scenario: this.editForm.get(['scenario'])!.value,
    };
  }
}
