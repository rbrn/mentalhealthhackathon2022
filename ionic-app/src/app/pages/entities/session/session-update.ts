import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Session } from './session.model';
import { SessionService } from './session.service';

@Component({
  selector: 'page-session-update',
  templateUrl: 'session-update.html',
})
export class SessionUpdatePage implements OnInit {
  session: Session;
  createdDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    order: [null, [Validators.required]],
    percentageResolved: [null, [Validators.required]],
    name: [null, [Validators.required]],
    createdDate: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private sessionService: SessionService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.session = response.data;
      this.isNew = this.session.id === null || this.session.id === undefined;
      this.updateForm(this.session);
    });
  }

  updateForm(session: Session) {
    this.form.patchValue({
      id: session.id,
      order: session.order,
      percentageResolved: session.percentageResolved,
      name: session.name,
      createdDate: this.isNew ? new Date().toISOString() : session.createdDate,
    });
  }

  save() {
    this.isSaving = true;
    const session = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.sessionService.update(session));
    } else {
      this.subscribeToSaveResponse(this.sessionService.create(session));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Session>>) {
    result.subscribe(
      (res: HttpResponse<Session>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Session ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/session');
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

  private createFromForm(): Session {
    return {
      ...new Session(),
      id: this.form.get(['id']).value,
      order: this.form.get(['order']).value,
      percentageResolved: this.form.get(['percentageResolved']).value,
      name: this.form.get(['name']).value,
      createdDate: new Date(this.form.get(['createdDate']).value),
    };
  }
}
