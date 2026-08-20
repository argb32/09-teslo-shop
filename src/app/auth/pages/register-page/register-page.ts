import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  fb = inject(FormBuilder);
  hasErrors = signal(false);

  authservice = inject(AuthService);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasErrors.set(true);
      setTimeout(() => {
        this.hasErrors.set(false);
      }, 2000);

      return;
    }

    const {
      email = '',
      password = '',
      fullName,
    } = this.registerForm.value;

    this.authservice
      .register(email!, password!, fullName!)
      .subscribe((isRegistered) => {
        if (isRegistered) {
          //TODO
        }
      });
  }
}
