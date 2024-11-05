import { Component } from '@angular/core';
import { QuizComponent } from './quiz/quiz.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QuizComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'AngularQuiz';
}
