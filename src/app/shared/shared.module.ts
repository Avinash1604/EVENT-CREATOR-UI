import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../common/header/header.component';



@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent]
})
export class SharedModule { }
