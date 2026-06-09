import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  registro(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  loginConGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  logout() {
    return signOut(auth);
  }

  esProgramador(email: string | null | undefined, programadores: any[]): boolean {
    if (!email) return false;
    return programadores.some(p => p.correo?.toLowerCase() === email.toLowerCase());
  }

  getProgramadorActual(email: string | null | undefined, programadores: any[]): any {
    if (!email) return null;
    return programadores.find(p => p.correo?.toLowerCase() === email.toLowerCase()) || null;
  }
}
