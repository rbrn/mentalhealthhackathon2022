import { Component, OnInit } from '@angular/core';
import { ScenarioStatusEvent } from './scenario-status-event.model';
import { ScenarioStatusEventService } from './scenario-status-event.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-scenario-status-event-detail',
  templateUrl: 'scenario-status-event-detail.html',
})
export class ScenarioStatusEventDetailPage implements OnInit {
  scenarioStatusEvent: ScenarioStatusEvent = {};

  constructor(
    private navController: NavController,
    private scenarioStatusEventService: ScenarioStatusEventService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.scenarioStatusEvent = response.data;
    });
  }

  open(item: ScenarioStatusEvent) {
    this.navController.navigateForward('/tabs/entities/scenario-status-event/' + item.id + '/edit');
  }

  async deleteModal(item: ScenarioStatusEvent) {
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
            this.scenarioStatusEventService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/scenario-status-event');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
