import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RegexEnum } from 'src/app/shared/regex';
import { ToasTMessageService } from 'src/app/shared/service/toast-message.service';
import { QuestionAnswer } from 'src/app/shared/models/question-answer.model';
import { PublicForm } from 'src/app/shared/models/public-form.model';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { PublicAccessibleServiceService } from './public-accessible-service.service';

export enum QuestionType {
  INPUT = 'Input',
  YES_NO = 'Yes_No',
  MULTIPLE_SELECT = 'Multiple_Selection_Text',
  DATE = 'Date',
  FILE = 'File'
}

export interface QuestionState {
  formControl: FormControl;
  questionType: string;
  validations: Array<any>;
  isValid: Boolean;
}

export interface AnswerDTO {
  questionId: number;
  questionType: string;
  answer: any;
}

@Component({
  selector: 'app-public-dynamic-form-page',
  templateUrl: './public-dynamic-form-page.component.html',
  styleUrls: ['./public-dynamic-form-page.component.css'],
  providers: [ConfirmationService]
})
export class PublicDynamicFormPageComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private elRef: ElementRef,
    private confirmationService: ConfirmationService,
    private publicAccessibleService: PublicAccessibleServiceService,
    private toastService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  bid: string = '';
  fid: string = '';
  trackingUrl: string = '';
  redirectUrl: string = '';
  isFormOnWebsite: any;
  gcaptchaKey: string = '';
  trackingCode: any;
  thankYouPageMessageContactForm: any;
  thankyouPageRedirect: boolean = false;
  showThankYou: boolean = false;

  formSubmissionId: number = 0;
  form!: PublicForm;
  formGroup!: FormGroup;
  questions!: Array<QuestionAnswer>;
  currentQuestionNo: number = 0;
  showQuestion: Boolean = false;
  _formState: Map<number, QuestionState> = new Map();
  dateFormat: string = 'mm/dd/yy';
  showTitle: Boolean = true;
  submitButtonText: string = 'Submit';
  backgroundColor: string = '#003B6F';
  foregroundColor: string = '#FFFFFF';
  value: number = 0;
  showForm: boolean = false;
  userEmail!: any;
  localStorageKey: string = '';
  localStorageMap: Map<number, object> = new Map();
  logoUrl: string = '';
  backgroundImageUrl: string = '~assets/large.jpeg';
  @ViewChild('backgroundImage') backgroundImageEl!: ElementRef;

  emailPopupForm!: FormGroup;
  showEmailPopup: boolean = false;
  showLogo: boolean = false;

  ngOnInit(): void {
    this.bid = this.activatedRoute.snapshot.params['bid'];
    this.fid = this.activatedRoute.snapshot.params['fid'];
    let source = this.activatedRoute.snapshot.params['source'];

    this.trackingUrl = document.referrer;
    if (
      this.trackingUrl &&
      (this.trackingUrl.includes('clinical-doc') || source == 'quickLinks')
    ) {
      this.trackingUrl = window.location.href;
    }

    let redirect = this.activatedRoute.snapshot.params['redirect'];
    if (redirect) {
      this.redirectUrl = this.activatedRoute.snapshot.params['redirectUrl'];
    }

    if (window.addEventListener) {
      window.addEventListener('message', this.handleMessage);
    } else {
      (<any>window).attachEvent('onmessage', this.handleMessage);
    }
    parent.postMessage('closeChat', '*');

    //this.gcaptchaKey = environment.siteKey;
    this.init();

    this.emailPopupForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(RegexEnum.email)
      ])
    });
  }

  handleMessage(e: any) {
    console.log('message from event listener', e);
    if (e && typeof e.data == 'string' && e.data.startsWith('http')) {
      this.trackingUrl = e.data;
      if (this.trackingUrl.includes('website')) {
        this.isFormOnWebsite = true;
      }
    }
  }

  init() {
    this.fid = "111";
    if (this.fid) {
            this.publicAccessibleService
              .getFormQuestionnaire(this.bid)
              .subscribe(
                (data: any) => {
                  if (data.thankYouPageUrl) {
                    this.thankyouPageRedirect = true;
                    this.redirectUrl = data.thankYouPageUrl;
                  }

                  if (data.configureThankYouMessageInContactForm) {
                    this.thankYouPageMessageContactForm =
                      data.thankYouPageMessageContactForm;
                  }

                  if (
                    data.googleAnalyticsGlobalCodeUrl != null &&
                    data.googleAnalyticsGlobalCodeUrl != ''
                  ) {
                    var s = document.createElement('script');
                    s.src = data.googleAnalyticsGlobalCodeUrl;
                    document.head.appendChild(s);

                    if (
                      data.googleAnalyticsGlobalCode != null &&
                      data.googleAnalyticsGlobalCode != ''
                    ) {
                      var str = data.googleAnalyticsGlobalCode;
                      str = str.replace(/<script>/g, '');
                      str = str.replace(/<\/script>/g, '');
                      var s1 = document.createElement('script');
                      s1.textContent = str;
                      document.head.appendChild(s1);
                      if (
                        data.landingPageTrackCode != null &&
                        data.landingPageTrackCode != ''
                      ) {
                        var str1 = data.landingPageTrackCode;
                        str1 = str1.replace(/<script>/g, '');
                        str1 = str1.replace(/<\/script>/g, '');
                        this.trackingCode = str1;
                      }
                    }
                  }
                  const captcha = document.createElement('script');
                  captcha.setAttribute(
                    'src',
                    'https://www.google.com/recaptcha/api.js?render=' +
                      this.gcaptchaKey
                  );
                  document.head.appendChild(captcha);

                  this.form = data;
                  let questions =
                    data.patientQuestionAnswers as QuestionAnswer[];
                  if (questions && questions.length > 0) {
                    questions = [...questions];
                    questions = questions.filter(
                      (question) => !question.hidden
                    );
                    this.questions = questions;
                  }

                  this.initializeQuestionsState();
                  this.localStorageKey = `q_${this.bid}_${this.fid}`;
                  const localStorageData = this.getLocalStorageData();
                  if (localStorageData && localStorageData.answers) {
                    this.localStorageMap = this.objectToMap(
                      localStorageData.answers
                    );
                    this.formSubmissionId = localStorageData.formSubmissionId;
                    this.setFormData(localStorageData.answers);
                    this.currentQuestionNo = this.getLastValidIndex();
                  }
                  this.formGroup = new FormGroup({
                    formControl: this.formControl
                  });

                  this.initializeUiState();

                  setTimeout(() => {
                    this.value =
                      (100 / this.questions.length) *
                      (this.currentQuestionNo + 1);
                    this.showForm = true;
                    this.showQuestion = true;
                  }, 200);
                },
                (error: any) => {
                  console.log('Error while fething Form data ===> ' + error);
                  this.toastService.errorToast(
                    'Form you are looking for not found.'
                  );
                }
              );
    }
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionNo];
  }

  get questionState() {
    return this._formState.get(this.currentQuestion.questionId)!;
  }

  get formControl(): any {
    return this._formState.get(this.currentQuestion.questionId)?.formControl;
  }

  get emailForm(): any {
    return this.emailPopupForm.controls;
  }

  initializeUiState() {
    if (this.form.backgroundImageUrl)
      this.backgroundImageUrl =
        this.form.backgroundImageUrl + '?t=' + Math.random();

    this.backgroundImageEl.nativeElement.style.backgroundImage = `url(${this.backgroundImageUrl})`;
    this.submitButtonText = this.form.submitButtonText || this.submitButtonText;
    this.showTitle = this.form.showTitle;
    this.showLogo = this.form.showLogo;

    this.backgroundColor =
      this.form.buttonBackgroundColor || this.backgroundColor;
    this.foregroundColor =
      this.form.buttonForegroundColor || this.foregroundColor;
    this.elRef.nativeElement.style.setProperty(
      '--form-color',
      this.backgroundColor
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-bg',
      this.foregroundColor
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-hover',
      this.colorLuminance(this.backgroundColor, 0.5)
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-active',
      this.colorLuminance(this.backgroundColor, 0.2)
    );
    this.elRef.nativeElement.style.setProperty(
      '--form-color-light',
      this.colorLuminance(this.backgroundColor, 0.9)
    );
  }

  initializeQuestionsState() {
    for (let question of this.questions) {
      let validations = [];
      if (question.required) validations.push(Validators.required);
      if (question.validate && question.regex) {
        if (question.questionType == QuestionType.DATE) {
          this.setDateFormat(question);
        } else {
          validations.push(Validators.pattern(question.regex));
        }
      }

      let controlValue = this.getControlValue(question);

      this._formState.set(question.questionId, {
        formControl: new FormControl(controlValue, validations),
        validations: validations,
        questionType: question.questionType,
        isValid: validations.length == 0
      });
    }
  }

  getControlValue(question: QuestionAnswer) {
    let controlValue;
    if (
      question.questionType == QuestionType.MULTIPLE_SELECT &&
      !question.showDropDown &&
      question.preSelectCheckbox
    ) {
      controlValue = question.patientQuestionChoices?.map(
        (choice: { choiceId: any }) => choice.choiceId
      );
    } else {
      controlValue = '';
    }
    return controlValue;
  }

  getLocalStorageData(): {
    formSubmissionId: number;
    answers: Map<number, object>;
  } {
      return this.localStorageService.readStorage(this.localStorageKey);
  }

  mapToObject(inputMap: Map<any, any>) {
    let obj: any = {};
    inputMap.forEach(function (value, key) {
      obj[key] = value;
    });
    return obj;
  }

  objectToMap(obj: object): Map<any, any> {
    obj = obj || {};
    const map = new Map();
    for (const [key, val] of Object.entries(obj)) {
      map.set(parseInt(key), val);
    }
    return map;
  }

  setUpdateLocalStorageData(answer: any) {
    this.localStorageMap.set(answer.questionId, answer.answer);
    this.localStorageService.storeItem(this.localStorageKey, {
      answers: this.mapToObject(this.localStorageMap),
      formSubmissionId: this.formSubmissionId
    });
  }

  updateLocalStorage() {
    this.localStorageService.storeItem(this.localStorageKey, {
      answers: this.mapToObject(this.localStorageMap),
      formSubmissionId: this.formSubmissionId
    });
  }

  setFormData(data: any) {
    for (const [key, val] of Object.entries(data)) {
      if (parseInt(key) == this.questions[0].questionId) {
        this.userEmail = val;
      }
      let questionState = this._formState.get(parseInt(key));
      questionState!.formControl.setValue(val);
      questionState!.isValid = true;
    }
  }

  setDateFormat(question: QuestionAnswer) {
    if (
      question.regex ==
      '^(0?[1-9]|[12][0-9]|3[01])[-/](0?[1-9]|1[012])[-/]((?:19|20|21)[0-9][0-9])$'
    ) {
      this.dateFormat = 'dd/mm/yy';
    } else if (
      question.regex ==
      '^(0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])[-/]((?:19|20|21)[0-9][0-9])$'
    ) {
      this.dateFormat = 'mm/dd/yy';
    } else if (
      question.regex ==
      '^((?:19|20|21)[0-9][0-9])[-/](0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])$'
    ) {
      this.dateFormat = 'yy/mm/dd';
    }
  }

  formatBytes(bytes: number, decimals: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  setAnswer() {
    this.questionState.isValid = this.formControl.valid;
    if (!this.formControl.valid) {
      this.formControl.markAllAsTouched();
      return;
    }
    this.setUpdateLocalStorageData({
      questionId: this.currentQuestion.questionId,
      answer: this.formControl.value
    });

    this.nextQuestion();

  }

  saveAnswers() {
    if (this.localStorageMap.size == 0) {
      this.toastService.errorToast('No Answers to save!');
      return;
    }
    this.ngxLoader.start();
    setTimeout(() => {
      this.ngxLoader.stop();
      this.toastService.success('Form saved successfully.');
    }, 1500);
  }

  loadAnswers() {
    this.showEmailPopup = true;
  }

  closeEmailPopup() {
    this.showEmailPopup = false;
    this.emailPopupForm.reset();
  }

  fetchAnswers() {
    // if (this.emailPopupForm.valid) {
    //   const email = this.emailPopupForm.controls['email'].value;
    //   this.publicAccessibleService.getAnswers(this.bid, this.fid, email).then(
    //     (response: any) => {
    //       this.formSubmissionId = response.formSubmissionId;
    //       this.closeEmailPopup();
    //       if (Object.entries(response.answers).length > 0) {
    //         this.formControl.setValue(email);
    //         this.questionState.isValid = true;
    //         this.userEmail = email;
    //         this.setUpdateLocalStorageData({
    //           questionId: this.currentQuestion.questionId,
    //           answer: email
    //         });
    //         this.setFormData(response.answers);
    //         Object.entries<object>(response.answers).forEach(([key, val]) => {
    //           this.localStorageMap.set(parseInt(key), val);
    //         });
    //         this.updateLocalStorage();
    //         let lastValid = this.getLastValidIndex();
    //         this.goToQuestion(lastValid);
    //         this.toastService.success('Form loaded successfully.');
    //       } else {
    //         this.toastService.info('No Form Found with your Email!');
    //       }
    //     },
    //     (err: any) => {
    //       this.toastService.errorToast('Unable to load your Form at the moment!');
    //     }
    //   );
    // }
  }

  changeAnswer(option: string) {
    this.formControl.setValue(option);
    this.setAnswer();
  }

  onFileChange(file: any) {
    // let fileUrl: string = this.formControl.value?.fileUrl;
    // if (fileUrl) {
    //   let keyPart = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    //   keyPart = keyPart.replace(
    //     `question_${this.formSubmissionId}_${this.currentQuestion.questionId}_`,
    //     ''
    //   );
    //   this.publicAccessibleService
    //     .deleteFile(
    //       this.bid,
    //       this.formSubmissionId,
    //       this.currentQuestion.questionId,
    //       keyPart
    //     )
    //     .then((response: any) => {
    //       if (!file) {
    //         this.formControl.setValue(null);
    //       } else {
    //         this.uploadFile(file);
    //       }
    //     })
    //     .catch((error: any) => {
    //       console.error('error while uploading file!!', error);
    //     });
    // } else {
    //   this.uploadFile(file);
    // }
  }

  uploadFile(file: any) {
    // let formData = new FormData();
    // formData.append('file', file);
    // this.publicAccessibleService
    //   .saveFile(
    //     this.bid,
    //     this.formSubmissionId,
    //     this.currentQuestion.questionId,
    //     formData
    //   )
    //   .then((response: any) => {
    //     let answer = {
    //       fileUrl: response.location,
    //       name: file.name,
    //       size: file.size
    //     };
    //     this.formControl.setValue(answer);
    //   })
    //   .catch((error: any) => {
    //     console.error('error while uploading file!!', error);
    //   });
  }

  onFileError(error: any) {
    if (error && error.length > 0) {
      this.toastService.errorToast(error);
    }
  }

  nextQuestion(fromUi?: boolean) {
    if (fromUi && (this.formControl.errors || this.formControl.dirty)) {
      this.setAnswer();
      return;
    }
    if (this.currentQuestionNo == this.questions.length - 1) {
      this.submitForm();
      return;
    }
    this.showQuestion = false;
    this.currentQuestionNo++;
    this.formGroup.setControl('formControl', this.formControl);
    setTimeout(() => {
      this.value = (100 / this.questions.length) * (this.currentQuestionNo + 1);
      if (
        (this.currentQuestion.questionType == QuestionType.DATE ||
          this.currentQuestion.questionType == QuestionType.FILE) &&
        !this.formControl.value
      ) {
        this.formControl.markAsUntouched();
        this.formControl.updateValueAndValidity();
      }
      this.showQuestion = true;
    }, 200);
  }

  prevQuestion() {
    this.showQuestion = false;
    this.currentQuestionNo--;
    this.formGroup.setControl('formControl', this.formControl);
    setTimeout(() => {
      this.showQuestion = true;
    }, 200);
  }

  goToQuestion(questionIndex: number) {
    this.showQuestion = false;
    this.currentQuestionNo = questionIndex;
    this.formGroup.setControl('formControl', this.formControl);
    setTimeout(() => {
      this.value = (100 / this.questions.length) * (this.currentQuestionNo + 1);
      this.showQuestion = true;
    }, 200);
  }

  isInvalid(): Boolean {
    return (
      this.formControl.invalid &&
      (this.formControl.dirty || this.formControl.touched)
    );
  }

  getLastValidIndex() {
    for (let i = this.questions.length - 1; i >= 0; i--) {
      if (this.localStorageMap.has(this.questions[i].questionId)) {
        return i;
      }
    }
    return 0;
  }

  submitForm() {
    this.ngxLoader.start();
    const answerMap: Map<number, any> = new Map();
    for (let i = 0; i < this.questions.length; i++) {
      let question = this.questions[i];
      let control = this._formState.get(question.questionId)!.formControl;
      if (!this._formState.get(question.questionId)!.isValid) {
        this.showQuestion = false;
        this.currentQuestionNo = i;
        this.formGroup.setControl('formControl', this.formControl);
        setTimeout(() => {
          this.showQuestion = true;
        }, 200);
        this.ngxLoader.stop();
        return;
      } else {
        answerMap.set(question.questionId, control.value);
      }
    }

    try {
      console.log(answerMap);
      const formData = [...this.form.patientQuestionAnswers];

      for (const question of formData) {
        if (question.hidden) continue;

        if (question.questionType == QuestionType.FILE) {
          question.answerText = answerMap.get(question.questionId).fileUrl;
        } else if (question.questionType == QuestionType.MULTIPLE_SELECT) {
          if (question.preSelectCheckbox || question.allowMultipleSelection) {
            let answerOptions: number[] = answerMap.get(question.questionId);
            if (answerOptions) {
              question.answerText = question.patientQuestionChoices
                .filter((choice: any) => answerOptions.includes(choice.choiceId))
                .map((choice: any) => choice.choiceName)
                .join(',');
            }
          } else {
            let answerChoice = question.patientQuestionChoices.find(
              (choice: any) => choice.choiceId == answerMap.get(question.questionId)
            );
            if (answerChoice)
              question.answerText = answerChoice.choiceName;
          }
        } else {
          question.answerText = answerMap.get(question.questionId);
        }
      }

      let source = 'Form';
      const formReq = {
        sourceUrl: this.trackingUrl,
        source: source,
        landingPageName: '',
        questionnaireId: this.fid,
        gcaptcharesponse: '',
        patientQuestionAnswers: formData
      };

      //this.executeGrecaptcha().then(
     //   (token) => {
          this.ngxLoader.stop();
        //  formReq.gcaptcharesponse = token;
          // this.publicAccessibleService
          //   .submitForm(this.bid, this.fid, formReq)
          //   .then(
          //     () => {
          //       this.localStorageService.removeStorage(this.localStorageKey);
          //       this.publicAccessibleService
          //         .deleteFormSubmission(this.bid, this.formSubmissionId)
          //         .then(
          //           () => {},
          //           (err: any) => {
          //             console.log('Error while deleting form submission!');
          //           }
          //         );

          //       var s2 = document.createElement('script');
          //       s2.textContent = this.trackingCode;
          //       document.head.appendChild(s2);

          //       if (this.thankyouPageRedirect) {
          //         window!.top!.location!.href = this.redirectUrl;
          //       } else {
          //         this.showForm = false;
          //         this.showThankYou = true;
          //       }
          //     },
          //     (err: any) => {
          //       console.log('error while submitting the form!');
          //       throw err;
          //     }
          //   );
      //  },
    //     (err) => {
    //       console.log('error while fetching recaptcha token');
    //       throw err;
    //     }
    //   );
    } catch (error) {
      this.ngxLoader.stop();
      this.toastService.errorToast('Unable to submit form. Please try again later.');
    }
  }

  // executeGrecaptcha(): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     if (!window.grecaptcha) {
  //       resolve('');
  //       return;
  //     }
  //     const captchaKey = this.gcaptchaKey;
  //     grecaptcha.ready(function () {
  //       grecaptcha
  //         .execute(captchaKey, {
  //           action: 'submit'
  //         })
  //         .then(
  //           function (token) {
  //             resolve(token);
  //           },
  //           (err) => {
  //             reject(err);
  //           }
  //         );
  //     });
  //   });
  // }

  colorLuminance(hex: string, lum: number) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = '#',
      c,
      i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substring(c.length);
    }
    return rgb;
  }
}
