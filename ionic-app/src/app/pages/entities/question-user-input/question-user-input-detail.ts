import { Component, OnInit } from '@angular/core';
import { QuestionUserInput } from './question-user-input.model';
import { QuestionUserInputService } from './question-user-input.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-question-user-input-detail',
  templateUrl: 'question-user-input-detail.html',
})
export class QuestionUserInputDetailPage implements OnInit {
  questionUserInput: QuestionUserInput = {};

  constructor(
    private navController: NavController,
    private questionUserInputService: QuestionUserInputService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.questionUserInput = response.data;
    });
  }

  open(item: QuestionUserInput) {
    this.navController.navigateForward('/tabs/entities/question-user-input/' + item.id + '/edit');
  }

  async deleteModal(item: QuestionUserInput) {
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
            this.questionUserInputService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/question-user-input');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
