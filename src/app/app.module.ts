import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './common/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingTemplateComponent } from './common/landing-template/landing-template.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
