import { Component, inject } from '@angular/core';
import { QuizService }       from "../../services/quiz.service";
import { AnswerComponent } from "../answer/answer.component";

@Component({
  selector: 'quiz-question',
  standalone: true,
  imports: [
    AnswerComponent
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})

export class QuestionComponent {
  quizService: QuizService = inject(QuizService);

}
