import { Component, inject, output, signal } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { AuthService } from '@core/services/auth/auth-service';
import { ToastService } from '@core/services/toast/toast-service';
import { Button } from '@shared/components/button/button';
import { FormTextfield } from '@shared/components/form-textfield/form-textfield';
import { Sprite } from '@shared/components/sprite/sprite';
import { getErrorMessage } from '@shared/utils/error.utils';
import { useServerErrorResetter } from '@shared/utils/server-error-resetter.utils';
import { EmailFormData, EMAIL_FORM_INIT_MODEL } from './email-form.model';
import { emailFormSchemaFn } from './email-form.schema';

@Component({
  selector: 'player-email-form',
  imports: [FormRoot, FormTextfield, Button, Sprite],
  templateUrl: './email-form.html',
  styleUrl: './email-form.scss',
})
export class EmailForm {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  private emailModel = signal<EmailFormData>(EMAIL_FORM_INIT_MODEL);
  protected emailForm = form(this.emailModel, (schemaPath) =>
    emailFormSchemaFn(schemaPath, this.authService.user()?.email)
  );

  protected isLoading = signal(false);
  protected serverError = signal('');
  readonly formsubmitted = output();

  private errorResetter = useServerErrorResetter({
    formModel: this.emailModel,
    error: this.serverError,
  });

  protected onSubmit() {
    const form = this.emailForm();
    if (form.invalid()) {
      form.markAsTouched();
      return;
    }
    this.errorResetter.markAsSubmitted();
    this.changeEmail();
  }

  // iam@gmail.com password!123
  private async changeEmail() {
    this.isLoading.set(true);
    const { email, password } = this.emailModel();
    try {
      await this.authService.updateEmail(email, password);
      this.toastService.success(`Confirmation email sent to ${email}.`);
      this.formsubmitted.emit();
    } catch (error) {
      this.serverError.set(getErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }
}
