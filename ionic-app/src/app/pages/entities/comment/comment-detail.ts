import { Component, OnInit } from '@angular/core';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-comment-detail',
  templateUrl: 'comment-detail.html',
})
export class CommentDetailPage implements OnInit {
  comment: Comment = {};

  constructor(
    private navController: NavController,
    private commentService: CommentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.comment = response.data;
    });
  }

  open(item: Comment) {
    this.navController.navigateForward('/tabs/entities/comment/' + item.id + '/edit');
  }

  async deleteModal(item: Comment) {
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
            this.commentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/comment');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
