import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isShowPassword = false;
  accountCreationMessage: any;
  errMsg = '';


  constructor( 
    private formBuilder: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  toggleShowPasswordFeild() {
    this.isShowPassword = !this.isShowPassword;
  }

  async submitForm() {
     this.router.navigate(['/admin/form-editor'])
  }

}
