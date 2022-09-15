import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Category } from './category.model';
import { CategoryService } from './category.service';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  categories: Category[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private categoryService: CategoryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.categories = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.categoryService
      .query()
      .pipe(
        filter((res: HttpResponse<Category[]>) => res.ok),
        map((res: HttpResponse<Category[]>) => res.body)
      )
      .subscribe(
        (response: Category[]) => {
          this.categories = response;
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

  trackId(index: number, item: Category) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/category/new');
  }

  async edit(item: IonItemSliding, category: Category) {
    await this.navController.navigateForward('/tabs/entities/category/' + category.id + '/edit');
    await item.close();
  }

  async delete(category) {
    this.categoryService.delete(category.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Category deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(category: Category) {
    await this.navController.navigateForward('/tabs/entities/category/' + category.id + '/view');
  }
}
