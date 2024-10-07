import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  signUp() {
    this.authService
      .signUp(this.email, this.password)
      .then(() => {
        this.toastr.success(
          `Welcome, ${this.email}! Your account has been created.`,
          'Signup Successful'
        );
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.toastr.error('Signup failed: ' + error.message, 'Error');
      });
  }

  signUpWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then(() => {
        this.toastr.success(
          'Welcome! Your account has been created via Google.',
          'Signup Successful'
        );
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.toastr.error(
          'Signup with Google failed: ' + error.message,
          'Error'
        );
      });
  }
}
