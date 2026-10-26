import { Component, inject, output, signal } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { AuthService } from '@core/services/auth/auth-service';
import { ToastService } from '@core/services/toast/toast-service';
import { Button } from '@shared/components/button/button';
import { FormTextfield } from '@shared/components/form-textfield/form-textfield';
import { Sprite } from '@shared/components/sprite/sprite';
import { getErrorMessage } from '@shared/utils/error.utils';
import { useServerErrorResetter } from '@shared/utils/server-error-resetter.utils';
import { PasswordFormData, PASSWORD_INIT_MODEL } from './password-form.model';
import { changePasswordSchemaFn } from './password-form.schema';

@Component({
  selector: 'player-password-form',
  imports: [FormRoot, Button, FormTextfield, Sprite],
  templateUrl: './password-form.html',
  styleUrl: './password-form.scss',
})
export class PasswordForm {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  private passwordModel = signal<PasswordFormData>(PASSWORD_INIT_MODEL);
  protected passwordForm = form(this.passwordModel, changePasswordSchemaFn);

  protected isLoading = signal(false);
  protected serverError = signal('');
  readonly formsubmitted = output();

  private errorResetter = useServerErrorResetter({
    formModel: this.passwordModel,
    error: this.serverError,
  });

  protected onSubmit() {
    const form = this.passwordForm();
    if (form.invalid()) {
      form.markAsTouched();
      return;
    }
    this.errorResetter.markAsSubmitted();
    this.changePassword();
  }

  private async changePassword() {
    this.isLoading.set(true);
    const { password, currentPassword } = this.passwordModel();
    try {
      await this.auth.updateUserPassword(password, currentPassword);
      this.formsubmitted.emit();
      this.toast.success('Password is changed');
    } catch (error) {
      this.serverError.set(getErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }
}
