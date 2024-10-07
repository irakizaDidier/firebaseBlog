import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .signIn(this.email, this.password)
      .then(() => {
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }

  loginWithGoogle() {
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
