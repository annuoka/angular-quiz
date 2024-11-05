import { NoopAnimationPlayer }                         from "@angular/animations";
import { CommonModule }                                from '@angular/common';
import { Component, inject, OnDestroy, OnInit }        from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule }                        from "@angular/platform-browser/animations";
import { DropdownModule }                              from 'primeng/dropdown';
import { AnswerComponent }                             from './components/answer/answer.component';
import { QuestionComponent }                           from './components/question/question.component';
import { QuizService }                                 from './services/quiz.service';
import { TriviaCategoryInterface }                     from "./types/category.interface";

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    CommonModule,
    QuestionComponent,
    AnswerComponent,
    QuestionComponent,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, OnDestroy {
  quizService: QuizService = inject(QuizService);
  categories: TriviaCategoryInterface[] | undefined;
  difficultyLevels = ['any difficulty','easy', 'medium', 'hard'];

  formGroup: FormGroup;
  constructor () {
    this.formGroup = new FormGroup({
      selectedCategory: new FormControl<TriviaCategoryInterface | null>(null),
      selectedDifficulty: new FormControl<string | null>(null)
    });
  }

  ngOnInit() {

    this.quizService.getCategories().subscribe({
      next: (categories ) => {
        this.categories = categories;
      },
      error: (error) => {
        this.quizService.error.set(error.message);
      },
    });
  }

  ngOnDestroy() {
    console.log('QuizComponent destroyed');
  }
}
