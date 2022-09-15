import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IScenario } from '../scenario.model';

@Component({
  selector: 'jhi-scenario-detail',
  templateUrl: './scenario-detail.component.html',
})
export class ScenarioDetailComponent implements OnInit {
  scenario: IScenario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ scenario }) => {
      this.scenario = scenario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
