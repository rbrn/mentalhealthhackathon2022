import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SubCategoryComponent } from '../list/sub-category.component';
import { SubCategoryDetailComponent } from '../detail/sub-category-detail.component';
import { SubCategoryUpdateComponent } from '../update/sub-category-update.component';
import { SubCategoryRoutingResolveService } from './sub-category-routing-resolve.service';

const subCategoryRoute: Routes = [
  {
    path: '',
    component: SubCategoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubCategoryDetailComponent,
    resolve: {
      subCategory: SubCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubCategoryUpdateComponent,
    resolve: {
      subCategory: SubCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubCategoryUpdateComponent,
    resolve: {
      subCategory: SubCategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(subCategoryRoute)],
  exports: [RouterModule],
})
export class SubCategoryRoutingModule {}
