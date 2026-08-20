import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  fb = inject(FormBuilder);
  hasErrors = signal(false);
  isPosting = signal(false);

  authServive = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasErrors.set(true);
      setTimeout(() => {
        this.hasErrors.set(false);
      }, 2000);

      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.authServive
      .login(email!, password!)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }
        this.hasErrors.set(true);
        setTimeout(() => {
          this.hasErrors.set(false);
        }, 2000);
      });
  }
}
