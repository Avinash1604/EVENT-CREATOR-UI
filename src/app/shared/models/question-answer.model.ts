export interface QuestionAnswer {
  id: any;
  questionId: number;
  label: string;
  type: string;
  hidden: boolean;
  required: boolean;
  validate: boolean;
  regex?: string;
  errorText?: string;
  answer: any;
  answerText: any;
  answerComments: any;
  answerOptions: any;
  questionChoices: any;
  values: any[];
  allowMultipleSelection: boolean;
  showDropDown: boolean;
  preSelectCheckbox: boolean;
  subHeading: string;
  description: string;
}
