import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
})
export class LoginPage {
  fb = inject(FormBuilder);
  hasErrors = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasErrors.set(true);
      setTimeout(() => {
        this.hasErrors.set(false)
      }, 2000);

      return;
    }

    const { email = '', password = '' } = this.loginForm.value

    console.log({ email, password })
  }

}
