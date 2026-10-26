import { Service, signal, computed, inject, effect } from '@angular/core';
import { Router } from '@angular/router';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { firebaseApp } from '@core/firebase/firebase.config';
import { REQUIRES_AUTH } from '@shared/constants/requires-auth.const';
import { RegisterInput } from '@shared/models/firestore.model';
import { AuthState } from '@shared/models/auth.model';

@Service()
export class AuthService {
  private router = inject(Router);
  private readonly auth = getAuth(firebaseApp);

  private _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private _authState = signal<AuthState>('loading');
  readonly authState = this._authState.asReadonly();

  readonly isCheckingAuth = computed(() => this.authState() === 'loading');
  readonly isAuthenticated = computed(() => this.authState() === 'auth');

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this._user.set(user);
      this._authState.set(user ? 'auth' : 'guest');
    });
    effect(() => {
      if (this.authState() !== 'guest') {
        return;
      }
      const activeRoute = this.router.routerState.snapshot.root.firstChild;
      if (activeRoute?.data?.[REQUIRES_AUTH]) {
        this.router.navigate(['/']);
      }
    });
  }

  private getRequiredUser(): User {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('[AuthService] Operation requires an authenticated user.');
    }
    return currentUser;
  }

  private async reauthenticate(password: string): Promise<User> {
    const user = this.getRequiredUser();
    if (!user.email) {
      throw new Error('[AuthService] User email is missing for reauthentication.');
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    return user;
  }

  async login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.handleError(error, 'login');
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      this.handleError(error, 'logout');
      throw error;
    }
  }

  async register(input: RegisterInput) {
    const { email, password, displayName } = input;
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      this.handleError(error, 'register');
      // TEMP: until ErrorHandlerService is implemented
      throw error;
    }
  }

  async updateDisplayName(displayName: string) {
    try {
      const user = this.getRequiredUser();
      await updateProfile(user, { displayName });
      this._user.set({ ...user });
    } catch (error) {
      this.handleError(error, 'updateDisplayName');
      throw error;
    }
  }

  async updateEmail(newEmail: string, currentPassword: string) {
    try {
      const user = await this.reauthenticate(currentPassword);
      await verifyBeforeUpdateEmail(user, newEmail, {
        url: `${window.location.origin}/account`,
      });
      this._user.set({ ...user });
    } catch (error) {
      this.handleError(error, 'updateEmail');
      throw error;
    }
  }

  async updateUserPassword(newPassword: string, currentPassword: string) {
    try {
      const user = await this.reauthenticate(currentPassword);
      await updatePassword(user, newPassword);
    } catch (error) {
      this.handleError(error, 'updateUserPassword');
      throw error;
    }
  }

  async deleteAccount(currentPassword: string) {
    try {
      const user = await this.reauthenticate(currentPassword);
      await deleteUser(user);
    } catch (error) {
      this.handleError(error, 'deleteAccount');
      throw error;
    }
  }

  // TEMP: local error handler until global ErrorHandlerService is implemented
  private handleError(error: unknown, context: string) {
    if (error instanceof FirebaseError) {
      console.error(`[${context}] ${error.message}`);
    } else {
      console.error(`[${context}] unknown error`, error);
    }
  }
}
