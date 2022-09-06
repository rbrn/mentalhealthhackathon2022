import { Component, OnInit } from '@angular/core';
import { Project } from './project.model';
import { ProjectService } from './project.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-project-detail',
  templateUrl: 'project-detail.html',
})
export class ProjectDetailPage implements OnInit {
  project: Project = {};

  constructor(
    private navController: NavController,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.project = response.data;
    });
  }

  open(item: Project) {
    this.navController.navigateForward('/tabs/entities/project/' + item.id + '/edit');
  }

  async deleteModal(item: Project) {
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
            this.projectService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/project');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
