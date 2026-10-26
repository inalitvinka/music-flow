import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth-service';
import { Button } from '@app/shared/components/button/button';
import { FormTextfield } from '@app/shared/components/form-textfield/form-textfield';
import { Sprite } from '@app/shared/components/sprite/sprite';
import { getErrorMessage } from '@app/shared/utils/error.utils';
import { useServerErrorResetter } from '@app/shared/utils/server-error-resetter.utils';
import { SIGNUP_INITIAL_MODEL, SignupFormData } from '../form/models/signup.model';
import { signupSchemaFn } from './signup.schema';

@Component({
  selector: 'player-signup',
  imports: [Button, FormTextfield, Sprite, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private authService = inject(AuthService);
  private router = inject(Router);

  protected error = signal('');
  protected loading = signal(false);

  protected signupModel = signal<SignupFormData>(SIGNUP_INITIAL_MODEL);
  protected signupForm = form(this.signupModel, signupSchemaFn);

  private errorResetter = useServerErrorResetter({
    formModel: this.signupModel,
    error: this.error,
  });

  async register(data: SignupFormData) {
    const { email, password, name: displayName } = data;

    this.loading.set(true);
    try {
      await this.authService.register({ email, password, displayName });
      this.router.navigate(['/']);
    } catch (error) {
      this.error.set(getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  protected onSubmit(event: Event) {
    event.preventDefault();

    if (!this.signupForm().valid()) {
      this.signupForm().markAsTouched();
      return;
    }
    this.signupModel.update((data) => ({
      ...data,
      name: data.name.replace(/\s+/g, ' '),
    }));
    this.errorResetter.markAsSubmitted();
    this.register(this.signupModel());
  }
}
