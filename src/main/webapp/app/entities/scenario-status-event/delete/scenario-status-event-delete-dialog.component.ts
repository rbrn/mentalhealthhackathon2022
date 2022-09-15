import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScenarioStatusEvent } from '../scenario-status-event.model';
import { ScenarioStatusEventService } from '../service/scenario-status-event.service';

@Component({
  templateUrl: './scenario-status-event-delete-dialog.component.html',
})
export class ScenarioStatusEventDeleteDialogComponent {
  scenarioStatusEvent?: IScenarioStatusEvent;

  constructor(protected scenarioStatusEventService: ScenarioStatusEventService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scenarioStatusEventService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
