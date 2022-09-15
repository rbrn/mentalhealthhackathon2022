import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestionUserInput } from '../question-user-input.model';
import { QuestionUserInputService } from '../service/question-user-input.service';

@Component({
  templateUrl: './question-user-input-delete-dialog.component.html',
})
export class QuestionUserInputDeleteDialogComponent {
  questionUserInput?: IQuestionUserInput;

  constructor(protected questionUserInputService: QuestionUserInputService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionUserInputService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
