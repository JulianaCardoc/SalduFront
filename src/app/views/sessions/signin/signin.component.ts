import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  form!: FormGroup;
  showPassword = false;
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  status: 'init' | 'loading' | 'success' | 'failed' = 'init';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }
  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  doLogin() {
    if (this.form.valid) {
      this.status = 'loading';
      const { email, password } = this.form.getRawValue();
      this.authService.login(email, password)
        .subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(['/invoices']);
          },
          error: () => {
            this.status = 'failed';
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
