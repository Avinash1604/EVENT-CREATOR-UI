import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../common/header/header.component';
import { PublicDynamicFormPageComponent } from '../admin/public-dynamic-form-page/public-dynamic-form-page.component';
import { DndModule } from 'ngx-drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [HeaderComponent, PublicDynamicFormPageComponent],
  imports: [
    CommonModule,
    DndModule,
    FormsModule,
    HttpClientModule,
    DialogModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    CalendarModule,
    RadioButtonModule,
    DropdownModule,
    MultiSelectModule,
    ProgressBarModule
  ],
  exports: [HeaderComponent, PublicDynamicFormPageComponent]
})
export class SharedModule { }
