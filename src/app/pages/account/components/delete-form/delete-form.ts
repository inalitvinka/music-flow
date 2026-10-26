import { Component, signal, output, inject } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { AuthService } from '@core/services/auth/auth-service';
import { ToastService } from '@core/services/toast/toast-service';
import { Button } from '@shared/components/button/button';
import { FormTextfield } from '@shared/components/form-textfield/form-textfield';
import { Sprite } from '@shared/components/sprite/sprite';
import { getErrorMessage } from '@shared/utils/error.utils';
import { useServerErrorResetter } from '@shared/utils/server-error-resetter.utils';
import { deleteAccountSchemaFn } from './delete-form.schema';

@Component({
  selector: 'player-delete-form',
  imports: [FormRoot, FormTextfield, Button, Sprite],
  templateUrl: './delete-form.html',
  styleUrl: './delete-form.scss',
})
export class DeleteForm {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  private deleteAccountModel = signal<{ password: string }>({ password: '' });
  protected deleteAccountForm = form(this.deleteAccountModel, deleteAccountSchemaFn);

  protected isLoading = signal(false);
  protected serverError = signal('');
  readonly formsubmitted = output();

  private errorResetter = useServerErrorResetter({
    formModel: this.deleteAccountModel,
    error: this.serverError,
  });

  protected onCancelClick() {
    this.formsubmitted.emit();
  }

  protected onSubmit() {
    const form = this.deleteAccountForm();
    if (form.invalid()) {
      form.markAsTouched();
      return;
    }
    this.errorResetter.markAsSubmitted();
    this.deleteAccount();
  }

  private async deleteAccount() {
    this.isLoading.set(true);
    try {
      await this.auth.deleteAccount(this.deleteAccountModel().password);
      this.formsubmitted.emit();
      this.toast.success('Account is deleted');
    } catch (error) {
      this.serverError.set(getErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }
}
