import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Question } from './question.model';
import { QuestionService } from './question.service';

@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {
  questions: Question[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private questionService: QuestionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.questions = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.questionService
      .query()
      .pipe(
        filter((res: HttpResponse<Question[]>) => res.ok),
        map((res: HttpResponse<Question[]>) => res.body)
      )
      .subscribe(
        (response: Question[]) => {
          this.questions = response;
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

  trackId(index: number, item: Question) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/question/new');
  }

  async edit(item: IonItemSliding, question: Question) {
    await this.navController.navigateForward('/tabs/entities/question/' + question.id + '/edit');
    await item.close();
  }

  async delete(question) {
    this.questionService.delete(question.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Question deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(question: Question) {
    await this.navController.navigateForward('/tabs/entities/question/' + question.id + '/view');
  }
}
