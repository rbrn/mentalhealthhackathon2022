import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { QuestionUserInputComponent } from './list/question-user-input.component';
import { QuestionUserInputDetailComponent } from './detail/question-user-input-detail.component';
import { QuestionUserInputUpdateComponent } from './update/question-user-input-update.component';
import { QuestionUserInputDeleteDialogComponent } from './delete/question-user-input-delete-dialog.component';
import { QuestionUserInputRoutingModule } from './route/question-user-input-routing.module';

@NgModule({
  imports: [SharedModule, QuestionUserInputRoutingModule],
  declarations: [
    QuestionUserInputComponent,
    QuestionUserInputDetailComponent,
    QuestionUserInputUpdateComponent,
    QuestionUserInputDeleteDialogComponent,
  ],
  entryComponents: [QuestionUserInputDeleteDialogComponent],
})
export class QuestionUserInputModule {}
