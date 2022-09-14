import { Component, OnInit } from '@angular/core';
import { Session } from './session.model';
import { SessionService } from './session.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-session-detail',
  templateUrl: 'session-detail.html',
})
export class SessionDetailPage implements OnInit {
  session: Session = {};

  constructor(
    private navController: NavController,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.session = response.data;
    });
  }

  open(item: Session) {
    this.navController.navigateForward('/tabs/entities/session/' + item.id + '/edit');
  }

  async deleteModal(item: Session) {
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
            this.sessionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/session');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
