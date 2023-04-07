export interface QuestionAnswer {
  id: any;
  questionId: number;
  questionName: string;
  questionType: string;
  hidden: boolean;
  required: boolean;
  validate: boolean;
  regex?: string;
  validationMessage?: string;
  answer: any;
  answerText: any;
  answerComments: any;
  answerOptions: any;
  questionChoices: any;
  patientQuestionChoices: any[];
  allowMultipleSelection: boolean;
  showDropDown: boolean;
  preSelectCheckbox: boolean;
  subHeading: string;
  description: string;
}
