import { CommonModule }              from "@angular/common";
import { Component, computed, inject, input } from '@angular/core';
import { QuizService }                        from '../../services/quiz.service';

@Component({
  selector: 'quiz-answer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.scss',
})
export class AnswerComponent {
  quizService: QuizService = inject(QuizService);

  answerText = input.required<string>();
  answerIndex = input.required<number>();

  lettersMapping: string[] = ['A', 'B', 'C', 'D'];

  isCorrectAnswer = computed(() => {
    return !!this.quizService.currentAnswer() &&
      this.answerText() === this.quizService.currentQuestion().correctAnswer;
  });
  isWrongAnswer = computed(() => {
    return this.answerText() === this.quizService.currentAnswer() &&
      this.answerText() !== this.quizService.currentQuestion().correctAnswer;
  });
}
