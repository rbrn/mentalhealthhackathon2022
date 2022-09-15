import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SubCategoryComponent } from './list/sub-category.component';
import { SubCategoryDetailComponent } from './detail/sub-category-detail.component';
import { SubCategoryUpdateComponent } from './update/sub-category-update.component';
import { SubCategoryDeleteDialogComponent } from './delete/sub-category-delete-dialog.component';
import { SubCategoryRoutingModule } from './route/sub-category-routing.module';

@NgModule({
  imports: [SharedModule, SubCategoryRoutingModule],
  declarations: [SubCategoryComponent, SubCategoryDetailComponent, SubCategoryUpdateComponent, SubCategoryDeleteDialogComponent],
  entryComponents: [SubCategoryDeleteDialogComponent],
})
export class SubCategoryModule {}
