import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScenarioComponent } from './list/scenario.component';
import { ScenarioDetailComponent } from './detail/scenario-detail.component';
import { ScenarioUpdateComponent } from './update/scenario-update.component';
import { ScenarioDeleteDialogComponent } from './delete/scenario-delete-dialog.component';
import { ScenarioRoutingModule } from './route/scenario-routing.module';

@NgModule({
  imports: [SharedModule, ScenarioRoutingModule],
  declarations: [ScenarioComponent, ScenarioDetailComponent, ScenarioUpdateComponent, ScenarioDeleteDialogComponent],
  entryComponents: [ScenarioDeleteDialogComponent],
})
export class ScenarioModule {}
