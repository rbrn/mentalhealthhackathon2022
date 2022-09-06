import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from '../../../services/utils/data-util.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Attachment } from './attachment.model';
import { AttachmentService } from './attachment.service';
import { Ticket, TicketService } from '../ticket';

@Component({
  selector: 'page-attachment-update',
  templateUrl: 'attachment-update.html',
})
export class AttachmentUpdatePage implements OnInit {
  attachment: Attachment;
  tickets: Ticket[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    file: [null, []],
    fileContentType: [null, []],
    ticket: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,
    private ticketService: TicketService,
    private attachmentService: AttachmentService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.ticketService.query().subscribe(
      data => {
        this.tickets = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.attachment = response.data;
      this.isNew = this.attachment.id === null || this.attachment.id === undefined;
      this.updateForm(this.attachment);
    });
  }

  updateForm(attachment: Attachment) {
    this.form.patchValue({
      id: attachment.id,
      name: attachment.name,
      file: attachment.file,
      fileContentType: attachment.fileContentType,
      ticket: attachment.ticket,
    });
  }

  save() {
    this.isSaving = true;
    const attachment = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.attachmentService.update(attachment));
    } else {
      this.subscribeToSaveResponse(this.attachmentService.create(attachment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Attachment>>) {
    result.subscribe(
      (res: HttpResponse<Attachment>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Attachment ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/attachment');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  private createFromForm(): Attachment {
    return {
      ...new Attachment(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      file: this.form.get(['file']).value,
      fileContentType: this.form.get(['fileContentType']).value,
      ticket: this.form.get(['ticket']).value,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
  }

  compareTicket(first: Ticket, second: Ticket): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTicketById(index: number, item: Ticket) {
    return item.id;
  }
}
