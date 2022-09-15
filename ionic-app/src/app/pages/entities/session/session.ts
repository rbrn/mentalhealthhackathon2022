import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Session } from './session.model';
import { SessionService } from './session.service';

@Component({
  selector: 'page-session',
  templateUrl: 'session.html',
})
export class SessionPage {
  sessions: Session[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private sessionService: SessionService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.sessions = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.sessionService
      .query()
      .pipe(
        filter((res: HttpResponse<Session[]>) => res.ok),
        map((res: HttpResponse<Session[]>) => res.body)
      )
      .subscribe(
        (response: Session[]) => {
          this.sessions = response;
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

  trackId(index: number, item: Session) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/session/new');
  }

  async edit(item: IonItemSliding, session: Session) {
    await this.navController.navigateForward('/tabs/entities/session/' + session.id + '/edit');
    await item.close();
  }

  async delete(session) {
    this.sessionService.delete(session.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Session deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(session: Session) {
    await this.navController.navigateForward('/tabs/entities/session/' + session.id + '/view');
  }
}
