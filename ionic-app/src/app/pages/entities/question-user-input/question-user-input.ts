import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { QuestionUserInput } from './question-user-input.model';
import { QuestionUserInputService } from './question-user-input.service';

@Component({
  selector: 'page-question-user-input',
  templateUrl: 'question-user-input.html',
})
export class QuestionUserInputPage {
  questionUserInputs: QuestionUserInput[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private questionUserInputService: QuestionUserInputService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.questionUserInputs = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.questionUserInputService
      .query()
      .pipe(
        filter((res: HttpResponse<QuestionUserInput[]>) => res.ok),
        map((res: HttpResponse<QuestionUserInput[]>) => res.body)
      )
      .subscribe(
        (response: QuestionUserInput[]) => {
          this.questionUserInputs = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: QuestionUserInput) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/question-user-input/new');
  }

  async edit(item: IonItemSliding, questionUserInput: QuestionUserInput) {
    await this.navController.navigateForward('/tabs/entities/question-user-input/' + questionUserInput.id + '/edit');
    await item.close();
  }

  async delete(questionUserInput) {
    this.questionUserInputService.delete(questionUserInput.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'QuestionUserInput deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(questionUserInput: QuestionUserInput) {
    await this.navController.navigateForward('/tabs/entities/question-user-input/' + questionUserInput.id + '/view');
  }
}
