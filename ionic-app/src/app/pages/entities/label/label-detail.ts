import { Component, OnInit } from '@angular/core';
import { Label } from './label.model';
import { LabelService } from './label.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-label-detail',
  templateUrl: 'label-detail.html',
})
export class LabelDetailPage implements OnInit {
  label: Label = {};

  constructor(
    private navController: NavController,
    private labelService: LabelService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.label = response.data;
    });
  }

  open(item: Label) {
    this.navController.navigateForward('/tabs/entities/label/' + item.id + '/edit');
  }

  async deleteModal(item: Label) {
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
            this.labelService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/label');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
