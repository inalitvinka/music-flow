import { Component, output, signal, inject } from '@angular/core';
import { form, FormRoot } from '@angular/forms/signals';
import { AuthService } from '@core/services/auth/auth-service';
import { ToastService } from '@core/services/toast/toast-service';
import { Button } from '@shared/components/button/button';
import { FormTextfield } from '@shared/components/form-textfield/form-textfield';
import { Sprite } from '@shared/components/sprite/sprite';
import { nameSchemaFn } from '@shared/schemas/name.schema';
import { getErrorMessage } from '@shared/utils/error.utils';
import { useServerErrorResetter } from '@shared/utils/server-error-resetter.utils';

interface NameFormData {
  name: string;
}

@Component({
  selector: 'player-display-name-form',
  imports: [FormRoot, Button, FormTextfield, Sprite],
  templateUrl: './display-name-form.html',
  styleUrl: './display-name-form.scss',
})
export class DisplayNameForm {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  private nameModel = signal<NameFormData>({ name: '' });
  protected nameForm = form(this.nameModel, nameSchemaFn);

  protected isLoading = signal(false);
  protected serverError = signal('');

  readonly formsubmitted = output();

  private errorResetter = useServerErrorResetter({
    formModel: this.nameModel,
    error: this.serverError,
  });

  protected onSubmit() {
    const form = this.nameForm();
    if (form.invalid()) {
      form.markAsTouched();
      return;
    }
    this.errorResetter.markAsSubmitted();
    this.changeName();
  }

  private async changeName() {
    this.isLoading.set(true);
    try {
      await this.authService.updateDisplayName(this.nameModel().name);
      this.toastService.success('Display name is changed');
      this.formsubmitted.emit();
    } catch (error) {
      this.serverError.set(getErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }
}
