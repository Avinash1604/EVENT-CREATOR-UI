import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { DndModule } from 'ngx-drag-drop';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PublicDynamicFormPageComponent } from './public-dynamic-form-page/public-dynamic-form-page.component';
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { NbDatepickerModule, NbDialogModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbSidebarService, NbThemeModule, NbToastrModule, NbWindowModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbMenuInternalService } from '@nebular/theme/components/menu/menu.service';
import { ThemeModule } from '../common/@theme/theme.module';
import { NbSecurityModule } from '@nebular/security';
import { TemplateListComponent } from './form/template-list/template-list.component';
import {TableModule} from 'primeng/table';

const appRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [{
        path: 'form-editor',
        component: FormEditorComponent
    }, {
      path: 'form-questions',
      component: PublicDynamicFormPageComponent
    },
    {
      path: 'forms',
      component: TemplateListComponent
    }]
  }
];


@NgModule({
  declarations: [
    AdminComponent,
    FormEditorComponent,
    TemplateListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    DndModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    CalendarModule,
    RadioButtonModule,
    DropdownModule,
    MultiSelectModule,
    ToastModule,
    ProgressBarModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbMenuModule,
    NbSidebarModule,
    ThemeModule,
    NbMenuModule,
    NbDatepickerModule,
    NbDialogModule,
    NbWindowModule,
    NbToastrModule,
    TableModule
  ]
})
export class AdminModule { }
