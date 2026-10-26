import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@core/services/auth/auth-service';
import { Button } from '@shared/components/button/button';
import { Dialog } from '@shared/components/dialog/dialog';
import { DisplayNameForm } from './components/display-name-form/display-name-form';
import { EmailForm } from './components/email-form/email-form';
import { PasswordForm } from './components/password-form/password-form';
import { DeleteForm } from './components/delete-form/delete-form';

type DialogType = 'displayName' | 'email' | 'password' | 'delete';

@Component({
  selector: 'player-account',
  imports: [Button, Dialog, DisplayNameForm, EmailForm, PasswordForm, DeleteForm],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private auth = inject(AuthService);
  protected readonly user = this.auth.user;
  protected dialogType = signal<DialogType | null>(null);

  protected openDialog(type: DialogType) {
    this.dialogType.set(type);
  }

  protected closeDialog() {
    this.dialogType.set(null);
  }
}
