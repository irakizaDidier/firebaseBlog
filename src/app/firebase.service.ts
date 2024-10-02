import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: any;
  public firestore: any;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(this.app);
  }
}
