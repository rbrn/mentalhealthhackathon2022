import { Component, OnInit } from '@angular/core';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-ticket-detail',
  templateUrl: 'ticket-detail.html',
})
export class TicketDetailPage implements OnInit {
  ticket: Ticket = {};

  constructor(
    private navController: NavController,
    private ticketService: TicketService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.ticket = response.data;
    });
  }

  open(item: Ticket) {
    this.navController.navigateForward('/tabs/entities/ticket/' + item.id + '/edit');
  }

  async deleteModal(item: Ticket) {
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
            this.ticketService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/ticket');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
