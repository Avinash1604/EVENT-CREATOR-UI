import { QuestionAnswer } from './question-answer.model';

export interface PublicForm {
  id: any;
  questionnaireId: number;
  questionnaireName: string;
  source: any;
  patientId: any;
  patientQuestionAnswers: QuestionAnswer[];
  showTitle: boolean;
  buttonBackgroundColor: any;
  buttonForegroundColor: any;
  backgroundImageUrl: string;
  activeSideColor: any;
  titleColor: any;
  popupTitleColor: any;
  popupLabelColor: any;
  inputBoxShadowColor: any;
  showTextForComposer: boolean;
  textForComposer: string;
  hideFieldTitle: boolean;
  css: any;
  trackCode: string;
  googleAnalyticsGlobalCode: string;
  googleAnalyticsGlobalCodeUrl: string;
  landingPageName: any;
  landingPageId: any;
  gcaptcharesponse: any;
  thankYouPageUrl: any;
  sourceUrl: any;
  amount: number;
  submitButtonText: any;
  showThankYouPageUrlLinkInContactForm: boolean;
  showThankYouPageUrlLinkInVC: boolean;
  showThankYouPageUrlLinkInLandingPage: boolean;
  thankYouPageUrlVC: any;
  thankYouPageUrlLandingPage: any;
  showLogo: any;
}