import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ScenarioStatusEvent } from './scenario-status-event.model';
import { ScenarioStatusEventService } from './scenario-status-event.service';

@Component({
  selector: 'page-scenario-status-event',
  templateUrl: 'scenario-status-event.html',
})
export class ScenarioStatusEventPage {
  scenarioStatusEvents: ScenarioStatusEvent[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private scenarioStatusEventService: ScenarioStatusEventService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.scenarioStatusEvents = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.scenarioStatusEventService
      .query()
      .pipe(
        filter((res: HttpResponse<ScenarioStatusEvent[]>) => res.ok),
        map((res: HttpResponse<ScenarioStatusEvent[]>) => res.body)
      )
      .subscribe(
        (response: ScenarioStatusEvent[]) => {
          this.scenarioStatusEvents = response;
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

  trackId(index: number, item: ScenarioStatusEvent) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/scenario-status-event/new');
  }

  async edit(item: IonItemSliding, scenarioStatusEvent: ScenarioStatusEvent) {
    await this.navController.navigateForward('/tabs/entities/scenario-status-event/' + scenarioStatusEvent.id + '/edit');
    await item.close();
  }

  async delete(scenarioStatusEvent) {
    this.scenarioStatusEventService.delete(scenarioStatusEvent.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ScenarioStatusEvent deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(scenarioStatusEvent: ScenarioStatusEvent) {
    await this.navController.navigateForward('/tabs/entities/scenario-status-event/' + scenarioStatusEvent.id + '/view');
  }
}
