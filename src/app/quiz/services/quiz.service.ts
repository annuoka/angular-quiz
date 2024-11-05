import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { TriviaCategoryInterface } from '../types/category.interface';
import {
  BEQuestionInterface,
  QuestionInterface,
} from '../types/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  http = inject(HttpClient);

  questions = signal<QuestionInterface[]>([]);
  currentQuestionIndex = signal<number>(0);
  currentAnswer = signal<string | null>(null);
  correctAnswersCount = signal<number>(0);
  error = signal<string | null>(null);
  selectedCategory = signal<number | null>(null);
  selectedDifficulty = signal<string | null>(null);

  currentQuestion = computed(
    () => this.questions()[this.currentQuestionIndex()],
  );
  showResults = computed(
    () =>
      this.questions().length > 0 &&
      this.currentQuestionIndex() === this.questions().length,
  );
  currentQuestionAnswers = computed(() =>
    this.shuffleAnswers(this.currentQuestion()),
  );

  shuffleAnswers(question: QuestionInterface): string[] {
    return [...question.incorrectAnswers, question.correctAnswer]
      .map((answer) => ({
        answer,
        sort: Math.random(),
      }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.answer)
      .map((answer) => answer);
  }

  selectAnswer(answerText: string): void {
    this.currentAnswer.set(answerText);
    const correctAnswersCount =
      answerText === this.currentQuestion().correctAnswer
        ? this.correctAnswersCount() + 1
        : this.correctAnswersCount();
    this.correctAnswersCount.set(correctAnswersCount);
  }

  goToNextQuestion(): void {
    const currentQuestionIndex = this.showResults()
      ? this.currentQuestionIndex()
      : this.currentQuestionIndex() + 1;
    this.currentQuestionIndex.set(currentQuestionIndex);
    this.currentAnswer.set(null);
  }

  getCategories(): Observable<TriviaCategoryInterface[]> {
    const categoriesUrl = 'https://opentdb.com/api_category.php';
    return this.http
      .get<{ trivia_categories: TriviaCategoryInterface[] }>(categoriesUrl)
      .pipe(
        tap((response) => {
          console.log(response);
        }),
        map((response) => response.trivia_categories),
      );
  }

getQuestions(): void {
  if (!this.selectedCategory() || !this.selectedDifficulty()) {
    return;
  }
  const difficulty =
    this.selectedDifficulty() === 'any difficulty'
      ? ''
      : `&difficulty=${this.selectedDifficulty()}`;

  const apiUrl = `https://opentdb.com/api.php?amount=10&category=${this.selectedCategory()}${difficulty}&type=multiple&encode=url3986`;
  this.http
    .get<{ results: BEQuestionInterface[] }>(apiUrl)
    .pipe(map((response) => this.normalizeQuestions(response.results)))
    .subscribe({
      next: (questions) => {
        this.questions.set(questions);
      },
      error: (error) => {
        this.error.set(error.message);
      }
    });
}

  normalizeQuestions(
    backendQuestions: BEQuestionInterface[],
  ): QuestionInterface[] {
    return backendQuestions.map((beQuestion) => {
      const incorrectAnswers: string[] = beQuestion.incorrect_answers.map(
        (incorrectAnswer: string) => {
          return decodeURIComponent(incorrectAnswer);
        },
      );
      return {
        question: decodeURIComponent(beQuestion.question),
        correctAnswer: decodeURIComponent(beQuestion.correct_answer),
        incorrectAnswers,
      };
    });
  }

  restart(): void {
    this.currentQuestionIndex.set(0);
    this.questions.set([]);
  }
}
