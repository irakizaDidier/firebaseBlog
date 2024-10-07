import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private angularFireAuth: AngularFireAuth) {}

  signUp(email: string, password: string) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string) {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider);
  }

  signOut() {
    return this.angularFireAuth.signOut();
  }

  resetPassword(email: string) {
    return this.angularFireAuth.sendPasswordResetEmail(email);
  }

  sendEmailVerification() {
    return this.angularFireAuth.currentUser.then((user) => {
      return user?.sendEmailVerification();
    });
  }

  getCurrentUser() {
    return this.angularFireAuth.authState;
  }
}
