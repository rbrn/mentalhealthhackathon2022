import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Scenario } from './scenario.model';
import { ScenarioService } from './scenario.service';

@Component({
  selector: 'page-scenario',
  templateUrl: 'scenario.html',
})
export class ScenarioPage {
  scenarios: Scenario[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private scenarioService: ScenarioService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.scenarios = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.scenarioService
      .query()
      .pipe(
        filter((res: HttpResponse<Scenario[]>) => res.ok),
        map((res: HttpResponse<Scenario[]>) => res.body)
      )
      .subscribe(
        (response: Scenario[]) => {
          this.scenarios = response;
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

  trackId(index: number, item: Scenario) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/scenario/new');
  }

  async edit(item: IonItemSliding, scenario: Scenario) {
    await this.navController.navigateForward('/tabs/entities/scenario/' + scenario.id + '/edit');
    await item.close();
  }

  async delete(scenario) {
    this.scenarioService.delete(scenario.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Scenario deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(scenario: Scenario) {
    await this.navController.navigateForward('/tabs/entities/scenario/' + scenario.id + '/view');
  }
}
