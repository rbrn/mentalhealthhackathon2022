import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubCategory } from '../sub-category.model';
import { SubCategoryService } from '../service/sub-category.service';

@Component({
  templateUrl: './sub-category-delete-dialog.component.html',
})
export class SubCategoryDeleteDialogComponent {
  subCategory?: ISubCategory;

  constructor(protected subCategoryService: SubCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subCategoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
