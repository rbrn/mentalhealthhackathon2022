import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScenarioStatusEventComponent } from './list/scenario-status-event.component';
import { ScenarioStatusEventDetailComponent } from './detail/scenario-status-event-detail.component';
import { ScenarioStatusEventUpdateComponent } from './update/scenario-status-event-update.component';
import { ScenarioStatusEventDeleteDialogComponent } from './delete/scenario-status-event-delete-dialog.component';
import { ScenarioStatusEventRoutingModule } from './route/scenario-status-event-routing.module';

@NgModule({
  imports: [SharedModule, ScenarioStatusEventRoutingModule],
  declarations: [
    ScenarioStatusEventComponent,
    ScenarioStatusEventDetailComponent,
    ScenarioStatusEventUpdateComponent,
    ScenarioStatusEventDeleteDialogComponent,
  ],
  entryComponents: [ScenarioStatusEventDeleteDialogComponent],
})
export class ScenarioStatusEventModule {}
