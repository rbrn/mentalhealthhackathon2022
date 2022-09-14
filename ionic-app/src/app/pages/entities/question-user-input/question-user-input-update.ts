import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { QuestionUserInput } from './question-user-input.model';
import { QuestionUserInputService } from './question-user-input.service';
import { Scenario, ScenarioService } from '../scenario';

@Component({
  selector: 'page-question-user-input-update',
  templateUrl: 'question-user-input-update.html',
})
export class QuestionUserInputUpdatePage implements OnInit {
  questionUserInput: QuestionUserInput;
  scenarios: Scenario[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    userId: [null, []],
    response: [null, []],
    scenario: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private scenarioService: ScenarioService,
    private questionUserInputService: QuestionUserInputService
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
      this.questionUserInput = response.data;
      this.isNew = this.questionUserInput.id === null || this.questionUserInput.id === undefined;
      this.updateForm(this.questionUserInput);
    });
  }

  updateForm(questionUserInput: QuestionUserInput) {
    this.form.patchValue({
      id: questionUserInput.id,
      userId: questionUserInput.userId,
      response: questionUserInput.response,
      scenario: questionUserInput.scenario,
    });
  }

  save() {
    this.isSaving = true;
    const questionUserInput = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.questionUserInputService.update(questionUserInput));
    } else {
      this.subscribeToSaveResponse(this.questionUserInputService.create(questionUserInput));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<QuestionUserInput>>) {
    result.subscribe(
      (res: HttpResponse<QuestionUserInput>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `QuestionUserInput ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/question-user-input');
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

  private createFromForm(): QuestionUserInput {
    return {
      ...new QuestionUserInput(),
      id: this.form.get(['id']).value,
      userId: this.form.get(['userId']).value,
      response: this.form.get(['response']).value,
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
