import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicDynamicFormPageComponent } from './admin/public-dynamic-form-page/public-dynamic-form-page.component';
import { AppComponent } from './app.component';
import { LandingTemplateComponent } from './common/landing-template/landing-template.component';
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
},
{
  path: 'register',
  component: RegisterComponent
},
{
  path: '',
  component: LandingTemplateComponent
},
{
  path: 'home',
  component: LandingTemplateComponent
},
{
    path: 'form-questions',
    component: PublicDynamicFormPageComponent
},
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
