import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './common/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingTemplateComponent } from './common/landing-template/landing-template.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule, NbSidebarService, NbToastrModule, NbWindowModule } from '@nebular/theme';
import { ThemeModule } from './common/@theme/theme.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingTemplateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
  ],
  providers: [NbSidebarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
