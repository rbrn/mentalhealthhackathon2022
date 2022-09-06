import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AttachmentPage } from './attachment';
import { AttachmentUpdatePage } from './attachment-update';
import { Attachment, AttachmentService, AttachmentDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AttachmentResolve implements Resolve<Attachment> {
  constructor(private service: AttachmentService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Attachment> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Attachment>) => response.ok),
        map((attachment: HttpResponse<Attachment>) => attachment.body)
      );
    }
    return of(new Attachment());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AttachmentPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AttachmentUpdatePage,
    resolve: {
      data: AttachmentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AttachmentDetailPage,
    resolve: {
      data: AttachmentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AttachmentUpdatePage,
    resolve: {
      data: AttachmentResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AttachmentPage, AttachmentUpdatePage, AttachmentDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AttachmentPageModule {}
