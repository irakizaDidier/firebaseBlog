import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    this.authService
      .signUp(this.email, this.password)
      .then(() => {
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }

  signUpWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then(() => {
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }
}
