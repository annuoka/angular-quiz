
export interface QuestionInterface {
	question: string;
	correctAnswer: string;
	incorrectAnswers: string[];
}

export interface BEQuestionInterface {
	question: string;
	answers: string[];
	correct_answer: string;
	incorrect_answers: string[];
	type: string;
	difficulty: string;
	category: string;

}