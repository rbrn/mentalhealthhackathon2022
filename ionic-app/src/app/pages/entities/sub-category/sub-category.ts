import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { SubCategory } from './sub-category.model';
import { SubCategoryService } from './sub-category.service';

@Component({
  selector: 'page-sub-category',
  templateUrl: 'sub-category.html',
})
export class SubCategoryPage {
  subCategories: SubCategory[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private subCategoryService: SubCategoryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.subCategories = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.subCategoryService
      .query()
      .pipe(
        filter((res: HttpResponse<SubCategory[]>) => res.ok),
        map((res: HttpResponse<SubCategory[]>) => res.body)
      )
      .subscribe(
        (response: SubCategory[]) => {
          this.subCategories = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: SubCategory) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/sub-category/new');
  }

  async edit(item: IonItemSliding, subCategory: SubCategory) {
    await this.navController.navigateForward('/tabs/entities/sub-category/' + subCategory.id + '/edit');
    await item.close();
  }

  async delete(subCategory) {
    this.subCategoryService.delete(subCategory.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'SubCategory deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(subCategory: SubCategory) {
    await this.navController.navigateForward('/tabs/entities/sub-category/' + subCategory.id + '/view');
  }
}
