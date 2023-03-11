import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingTemplateComponent } from './common/landing-template/landing-template.component';
import { LoginComponent } from './common/login/login.component';

const routes: Routes = [{
  path: 'login',
  component: LoginComponent
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
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
