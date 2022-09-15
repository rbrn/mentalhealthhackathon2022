import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Question } from './question.model';
import { QuestionService } from './question.service';

@Component({
  selector: 'page-question-update',
  templateUrl: 'question-update.html',
})
export class QuestionUpdatePage implements OnInit {
  question: Question;
  createdDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    title: [null, [Validators.required]],
    text: [null, [Validators.required]],
    correctAnswer: ['false', [Validators.required]],
    correctAnswerFeedback: ['false', [Validators.required]],
    wrongAnswerFeedback: ['false', [Validators.required]],
    createdDate: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private questionService: QuestionService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.question = response.data;
      this.isNew = this.question.id === null || this.question.id === undefined;
      this.updateForm(this.question);
    });
  }

  updateForm(question: Question) {
    this.form.patchValue({
      id: question.id,
      title: question.title,
      text: question.text,
      correctAnswer: question.correctAnswer,
      correctAnswerFeedback: question.correctAnswerFeedback,
      wrongAnswerFeedback: question.wrongAnswerFeedback,
      createdDate: this.isNew ? new Date().toISOString() : question.createdDate,
    });
  }

  save() {
    this.isSaving = true;
    const question = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.questionService.update(question));
    } else {
      this.subscribeToSaveResponse(this.questionService.create(question));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Question>>) {
    result.subscribe(
      (res: HttpResponse<Question>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Question ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/question');
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

  private createFromForm(): Question {
    return {
      ...new Question(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      text: this.form.get(['text']).value,
      correctAnswer: this.form.get(['correctAnswer']).value,
      correctAnswerFeedback: this.form.get(['correctAnswerFeedback']).value,
      wrongAnswerFeedback: this.form.get(['wrongAnswerFeedback']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
    };
  }
}
