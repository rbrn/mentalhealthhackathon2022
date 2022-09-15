import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ScenarioStatusEvent } from './scenario-status-event.model';
import { ScenarioStatusEventService } from './scenario-status-event.service';
import { Scenario, ScenarioService } from '../scenario';

@Component({
  selector: 'page-scenario-status-event-update',
  templateUrl: 'scenario-status-event-update.html',
})
export class ScenarioStatusEventUpdatePage implements OnInit {
  scenarioStatusEvent: ScenarioStatusEvent;
  scenarios: Scenario[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    userId: [null, []],
    eventType: [null, []],
    scenario: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private scenarioService: ScenarioService,
    private scenarioStatusEventService: ScenarioStatusEventService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.scenarioService.query().subscribe(
      data => {
        this.scenarios = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.scenarioStatusEvent = response.data;
      this.isNew = this.scenarioStatusEvent.id === null || this.scenarioStatusEvent.id === undefined;
      this.updateForm(this.scenarioStatusEvent);
    });
  }

  updateForm(scenarioStatusEvent: ScenarioStatusEvent) {
    this.form.patchValue({
      id: scenarioStatusEvent.id,
      userId: scenarioStatusEvent.userId,
      eventType: scenarioStatusEvent.eventType,
      scenario: scenarioStatusEvent.scenario,
    });
  }

  save() {
    this.isSaving = true;
    const scenarioStatusEvent = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.scenarioStatusEventService.update(scenarioStatusEvent));
    } else {
      this.subscribeToSaveResponse(this.scenarioStatusEventService.create(scenarioStatusEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ScenarioStatusEvent>>) {
    result.subscribe(
      (res: HttpResponse<ScenarioStatusEvent>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `ScenarioStatusEvent ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/scenario-status-event');
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

  private createFromForm(): ScenarioStatusEvent {
    return {
      ...new ScenarioStatusEvent(),
      id: this.form.get(['id']).value,
      userId: this.form.get(['userId']).value,
      eventType: this.form.get(['eventType']).value,
      scenario: this.form.get(['scenario']).value,
    };
  }

  compareScenario(first: Scenario, second: Scenario): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackScenarioById(index: number, item: Scenario) {
    return item.id;
  }
}
