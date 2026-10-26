import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth-service';
import { Button } from '@app/shared/components/button/button';
import { FormTextfield } from '@app/shared/components/form-textfield/form-textfield';
import { Sprite } from '@app/shared/components/sprite/sprite';
import { getErrorMessage } from '@app/shared/utils/error.utils';
import { useServerErrorResetter } from '@app/shared/utils/server-error-resetter.utils';
import { LOGIN_INITIAL_MODEL, LoginFormData } from '../form/models/login.model';
import { loginSchemaFn } from './login.schema';

@Component({
  selector: 'player-login',
  imports: [Button, FormTextfield, Sprite, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  protected authService = inject(AuthService);
  private readonly router = inject(Router);

  protected error = signal('');
  protected loading = signal(false);

  protected loginModel = signal<LoginFormData>(LOGIN_INITIAL_MODEL);
  protected loginForm = form(this.loginModel, loginSchemaFn);

  private errorResetter = useServerErrorResetter({
    formModel: this.loginModel,
    error: this.error,
  });

  private async login({ email, password }: LoginFormData) {
    this.loading.set(true);
    try {
      await this.authService.login(email, password);
      this.router.navigate(['/']);
    } catch (error) {
      this.error.set(getErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  protected onSubmit(event: Event) {
    event.preventDefault();

    if (!this.loginForm().valid()) {
      this.loginForm().markAsTouched();
      return;
    }
    this.errorResetter.markAsSubmitted();
    this.login(this.loginModel());
  }
}
