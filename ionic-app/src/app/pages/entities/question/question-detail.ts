import { Component, OnInit } from '@angular/core';
import { Question } from './question.model';
import { QuestionService } from './question.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-question-detail',
  templateUrl: 'question-detail.html',
})
export class QuestionDetailPage implements OnInit {
  question: Question = {};

  constructor(
    private navController: NavController,
    private questionService: QuestionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.question = response.data;
    });
  }

  open(item: Question) {
    this.navController.navigateForward('/tabs/entities/question/' + item.id + '/edit');
  }

  async deleteModal(item: Question) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.questionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/question');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
