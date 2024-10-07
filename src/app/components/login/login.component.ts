import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login() {
    this.authService
      .signIn(this.email, this.password)
      .then(() => {
        this.toastr.success(`Welcome back, ${this.email}!`, 'Login Successful');
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.toastr.error('Login failed: ' + error.message, 'Error');
      });
  }

  loginWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then(() => {
        this.toastr.success(`Welcome back!`, 'Login Successful');
        this.router.navigate(['/blog']);
      })
      .catch((error) => {
        this.toastr.error('Login failed: ' + error.message, 'Error');
      });
  }
}
