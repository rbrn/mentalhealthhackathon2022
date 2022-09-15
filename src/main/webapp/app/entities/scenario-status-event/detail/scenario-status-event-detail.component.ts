import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IScenarioStatusEvent } from '../scenario-status-event.model';

@Component({
  selector: 'jhi-scenario-status-event-detail',
  templateUrl: './scenario-status-event-detail.component.html',
})
export class ScenarioStatusEventDetailComponent implements OnInit {
  scenarioStatusEvent: IScenarioStatusEvent | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scenarioStatusEvent }) => {
      this.scenarioStatusEvent = scenarioStatusEvent;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
