import { Component, OnInit } from '@angular/core';
import { SubCategory } from './sub-category.model';
import { SubCategoryService } from './sub-category.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-sub-category-detail',
  templateUrl: 'sub-category-detail.html',
})
export class SubCategoryDetailPage implements OnInit {
  subCategory: SubCategory = {};

  constructor(
    private navController: NavController,
    private subCategoryService: SubCategoryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.subCategory = response.data;
    });
  }

  open(item: SubCategory) {
    this.navController.navigateForward('/tabs/entities/sub-category/' + item.id + '/edit');
  }

  async deleteModal(item: SubCategory) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.subCategoryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/sub-category');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
