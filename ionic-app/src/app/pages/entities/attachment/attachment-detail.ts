import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { Attachment } from './attachment.model';
import { AttachmentService } from './attachment.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-attachment-detail',
  templateUrl: 'attachment-detail.html',
})
export class AttachmentDetailPage implements OnInit {
  attachment: Attachment = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private attachmentService: AttachmentService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.attachment = response.data;
    });
  }

  open(item: Attachment) {
    this.navController.navigateForward('/tabs/entities/attachment/' + item.id + '/edit');
  }

  async deleteModal(item: Attachment) {
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
            this.attachmentService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/attachment');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
