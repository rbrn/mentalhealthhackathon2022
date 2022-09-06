import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Project', component: 'ProjectPage', route: 'project' },
    { name: 'Label', component: 'LabelPage', route: 'label' },
    { name: 'Ticket', component: 'TicketPage', route: 'ticket' },
    { name: 'Attachment', component: 'AttachmentPage', route: 'attachment' },
    { name: 'Comment', component: 'CommentPage', route: 'comment' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
