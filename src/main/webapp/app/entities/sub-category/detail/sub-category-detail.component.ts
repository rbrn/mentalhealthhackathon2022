import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubCategory } from '../sub-category.model';

@Component({
  selector: 'jhi-sub-category-detail',
  templateUrl: './sub-category-detail.component.html',
})
export class SubCategoryDetailComponent implements OnInit {
  subCategory: ISubCategory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subCategory }) => {
      this.subCategory = subCategory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
