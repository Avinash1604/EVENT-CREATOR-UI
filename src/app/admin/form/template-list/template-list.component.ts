import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateServiceService } from '../template-service.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {

  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'noOfQuestions',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Id', field: 'questionnaireId' },
    { header: 'Name', field: 'questionnaireName' },
    { header: 'Number Of Questions', field: 'noOfQuestions' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  data: any;
  constructor(
    private router: Router,
    private templateService: TemplateServiceService
  ) {}

  ngOnInit(): void {
    this.loadQuestionarie();
  }

  loadQuestionarie() {
    this.templateService.getTemplates().then(
      (data: any) => {
        this.rowData = [JSON.parse(data)];
      },
      () => {
       // this.toastMessageService.error('Unable to load Questionaires.');
      }
    );
  }

  navigateTo() {
    this.router.navigateByUrl('/admin/form-editor');
  }

  editTemplate(id: any) {
    this.router.navigate(['form-builder', id, 'edit']);
  }

  openFormsNewWindow(form: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/form-questions'], {
        queryParams: {
          "fid": form.questionnaireId
        }
      })
    );
  
    window.open(url, '_blank');
  }

  deleteTemplateModal(data: any) {
    this.data = data;
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Questionnaire';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteQuestionaire(this.modalData.id);
    }
  }

  deleteQuestionaire(id: any) {
    // this.templateService.deleteQuestionarie(id).then(
    //   () => {
    //     this.rowData = [];
    //     //this.toastMessageService.success('The Questionnaire has been deleted.');
    //     this.loadQuestionarie();
    //   },
    //   () => {
    //     //this.toastMessageService.error('Unable to delete Questionnaire.');
    //   }
    // );
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
