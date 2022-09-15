import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScenario } from '../scenario.model';
import { ScenarioService } from '../service/scenario.service';

@Component({
  templateUrl: './scenario-delete-dialog.component.html',
})
export class ScenarioDeleteDialogComponent {
  scenario?: IScenario;

  constructor(protected scenarioService: ScenarioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.scenarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
