import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Attachment } from './attachment.model';
import { AttachmentService } from './attachment.service';

@Component({
  selector: 'page-attachment',
  templateUrl: 'attachment.html',
})
export class AttachmentPage {
  attachments: Attachment[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private attachmentService: AttachmentService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.attachments = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.attachmentService
      .query()
      .pipe(
        filter((res: HttpResponse<Attachment[]>) => res.ok),
        map((res: HttpResponse<Attachment[]>) => res.body)
      )
      .subscribe(
        (response: Attachment[]) => {
          this.attachments = response;
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

  trackId(index: number, item: Attachment) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/attachment/new');
  }

  async edit(item: IonItemSliding, attachment: Attachment) {
    await this.navController.navigateForward('/tabs/entities/attachment/' + attachment.id + '/edit');
    await item.close();
  }

  async delete(attachment) {
    this.attachmentService.delete(attachment.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Attachment deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(attachment: Attachment) {
    await this.navController.navigateForward('/tabs/entities/attachment/' + attachment.id + '/view');
  }
}
