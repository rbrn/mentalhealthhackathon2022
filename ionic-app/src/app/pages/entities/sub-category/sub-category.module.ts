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

import { SubCategoryPage } from './sub-category';
import { SubCategoryUpdatePage } from './sub-category-update';
import { SubCategory, SubCategoryService, SubCategoryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class SubCategoryResolve implements Resolve<SubCategory> {
  constructor(private service: SubCategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SubCategory> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<SubCategory>) => response.ok),
        map((subCategory: HttpResponse<SubCategory>) => subCategory.body)
      );
    }
    return of(new SubCategory());
  }
}

const routes: Routes = [
  {
    path: '',
    component: SubCategoryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubCategoryUpdatePage,
    resolve: {
      data: SubCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubCategoryDetailPage,
    resolve: {
      data: SubCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubCategoryUpdatePage,
    resolve: {
      data: SubCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [SubCategoryPage, SubCategoryUpdatePage, SubCategoryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class SubCategoryPageModule {}
