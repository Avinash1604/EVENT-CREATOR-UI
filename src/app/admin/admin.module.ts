import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { DndModule } from 'ngx-drag-drop';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
const appRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [{
        path: 'form-editor',
        component: FormEditorComponent
    }]
  }
];


@NgModule({
  declarations: [
    AdminComponent,
    FormEditorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
    DndModule,
    FormsModule,
    SharedModule
  ]
})
export class AdminModule { }
