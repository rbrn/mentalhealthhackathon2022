import { Component, OnInit } from '@angular/core';
import { Scenario } from './scenario.model';
import { ScenarioService } from './scenario.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-scenario-detail',
  templateUrl: 'scenario-detail.html',
})
export class ScenarioDetailPage implements OnInit {
  scenario: Scenario = {};

  constructor(
    private navController: NavController,
    private scenarioService: ScenarioService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.scenario = response.data;
    });
  }

  open(item: Scenario) {
    this.navController.navigateForward('/tabs/entities/scenario/' + item.id + '/edit');
  }

  async deleteModal(item: Scenario) {
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
            this.scenarioService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/scenario');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
