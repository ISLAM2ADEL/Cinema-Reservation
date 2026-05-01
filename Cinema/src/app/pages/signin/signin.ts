import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html', 
  styleUrls: ['./signin.css']   
})
export class Signin {
  signinForm: FormGroup;
  isPasswordVisible: boolean = false;
  private authService = inject(Auth);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.authService.login(this.signinForm.value).subscribe({
        next: (response) => {
          console.log('Login Success!', response);
          
          localStorage.setItem('token', response.token); 
          
          this.router.navigate(['/home']); 
        },
        error: (err) => {
          console.error('Login Error', err);
          alert('Invalid email or password!'); 
        }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }
}