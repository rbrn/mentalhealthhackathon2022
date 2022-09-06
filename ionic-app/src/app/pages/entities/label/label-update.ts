import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Label } from './label.model';
import { LabelService } from './label.service';
import { Ticket, TicketService } from '../ticket';

@Component({
  selector: 'page-label-update',
  templateUrl: 'label-update.html',
})
export class LabelUpdatePage implements OnInit {
  label: Label;
  tickets: Ticket[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    label: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private ticketService: TicketService,
    private labelService: LabelService
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
      this.label = response.data;
      this.isNew = this.label.id === null || this.label.id === undefined;
      this.updateForm(this.label);
    });
  }

  updateForm(label: Label) {
    this.form.patchValue({
      id: label.id,
      label: label.label,
    });
  }

  save() {
    this.isSaving = true;
    const label = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.labelService.update(label));
    } else {
      this.subscribeToSaveResponse(this.labelService.create(label));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Label>>) {
    result.subscribe(
      (res: HttpResponse<Label>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Label ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/label');
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

  private createFromForm(): Label {
    return {
      ...new Label(),
      id: this.form.get(['id']).value,
      label: this.form.get(['label']).value,
    };
  }

  compareTicket(first: Ticket, second: Ticket): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTicketById(index: number, item: Ticket) {
    return item.id;
  }
}
