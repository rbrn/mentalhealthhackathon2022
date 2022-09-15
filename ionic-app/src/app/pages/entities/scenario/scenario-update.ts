import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Scenario } from './scenario.model';
import { ScenarioService } from './scenario.service';
import { Category, CategoryService } from '../category';
import { SubCategory, SubCategoryService } from '../sub-category';
import { Question, QuestionService } from '../question';
import { Session, SessionService } from '../session';

@Component({
  selector: 'page-scenario-update',
  templateUrl: 'scenario-update.html',
})
export class ScenarioUpdatePage implements OnInit {
  scenario: Scenario;
  categories: Category[];
  subCategories: SubCategory[];
  questions: Question[];
  sessions: Session[];
  createdDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    order: [null, [Validators.required]],
    name: [null, [Validators.required]],
    identifier: [null, [Validators.required]],
    text: [null, [Validators.required]],
    audioFileName: [null, [Validators.required]],
    rntype: [null, []],
    theme: [null, []],
    scenarioNumber: [null, []],
    trialType: [null, []],
    repeatable: ['false', []],
    positivity: ['false', []],
    vividness: ['false', []],
    createdDate: [null, []],
    category: [null, []],
    subcategory: [null, []],
    question: [null, []],
    session: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private questionService: QuestionService,
    private sessionService: SessionService,
    private scenarioService: ScenarioService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.categoryService.query({ filter: 'scenario-is-null' }).subscribe(
      data => {
        if (!this.scenario.category || !this.scenario.category.id) {
          this.categories = data.body;
        } else {
          this.categoryService.find(this.scenario.category.id).subscribe(
            (subData: HttpResponse<Category>) => {
              this.categories = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.subCategoryService.query({ filter: 'scenario-is-null' }).subscribe(
      data => {
        if (!this.scenario.subcategory || !this.scenario.subcategory.id) {
          this.subCategories = data.body;
        } else {
          this.subCategoryService.find(this.scenario.subcategory.id).subscribe(
            (subData: HttpResponse<SubCategory>) => {
              this.subCategories = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.questionService.query({ filter: 'scenario-is-null' }).subscribe(
      data => {
        if (!this.scenario.question || !this.scenario.question.id) {
          this.questions = data.body;
        } else {
          this.questionService.find(this.scenario.question.id).subscribe(
            (subData: HttpResponse<Question>) => {
              this.questions = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.sessionService.query().subscribe(
      data => {
        this.sessions = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.scenario = response.data;
      this.isNew = this.scenario.id === null || this.scenario.id === undefined;
      this.updateForm(this.scenario);
    });
  }

  updateForm(scenario: Scenario) {
    this.form.patchValue({
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
      createdDate: this.isNew ? new Date().toISOString() : scenario.createdDate,
      category: scenario.category,
      subcategory: scenario.subcategory,
      question: scenario.question,
      session: scenario.session,
    });
  }

  save() {
    this.isSaving = true;
    const scenario = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.scenarioService.update(scenario));
    } else {
      this.subscribeToSaveResponse(this.scenarioService.create(scenario));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Scenario>>) {
    result.subscribe(
      (res: HttpResponse<Scenario>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Scenario ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/scenario');
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

  private createFromForm(): Scenario {
    return {
      ...new Scenario(),
      id: this.form.get(['id']).value,
      order: this.form.get(['order']).value,
      name: this.form.get(['name']).value,
      identifier: this.form.get(['identifier']).value,
      text: this.form.get(['text']).value,
      audioFileName: this.form.get(['audioFileName']).value,
      rntype: this.form.get(['rntype']).value,
      theme: this.form.get(['theme']).value,
      scenarioNumber: this.form.get(['scenarioNumber']).value,
      trialType: this.form.get(['trialType']).value,
      repeatable: this.form.get(['repeatable']).value,
      positivity: this.form.get(['positivity']).value,
      vividness: this.form.get(['vividness']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
      category: this.form.get(['category']).value,
      subcategory: this.form.get(['subcategory']).value,
      question: this.form.get(['question']).value,
      session: this.form.get(['session']).value,
    };
  }

  compareCategory(first: Category, second: Category): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCategoryById(index: number, item: Category) {
    return item.id;
  }
  compareSubCategory(first: SubCategory, second: SubCategory): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackSubCategoryById(index: number, item: SubCategory) {
    return item.id;
  }
  compareQuestion(first: Question, second: Question): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackQuestionById(index: number, item: Question) {
    return item.id;
  }
  compareSession(first: Session, second: Session): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackSessionById(index: number, item: Session) {
    return item.id;
  }
}
