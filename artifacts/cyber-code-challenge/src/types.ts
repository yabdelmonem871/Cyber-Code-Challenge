export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "scenario"
  | "fill-blank"
  | "sequencing"
  | "matching"
  | "short-answer";

export interface AnswerChoice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  choices: AnswerChoice[];
  correctChoiceId: string;
  explanation: string;
  hint: string;
  topic: string;
  lesson: "1-1" | "1-2" | "1-3" | "1-4";
  difficulty: Difficulty;
}
