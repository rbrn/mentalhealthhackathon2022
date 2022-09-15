import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestionUserInput } from '../question-user-input.model';

@Component({
  selector: 'jhi-question-user-input-detail',
  templateUrl: './question-user-input-detail.component.html',
})
export class QuestionUserInputDetailComponent implements OnInit {
  questionUserInput: IQuestionUserInput | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionUserInput }) => {
      this.questionUserInput = questionUserInput;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
