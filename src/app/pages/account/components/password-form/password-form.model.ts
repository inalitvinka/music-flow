import { ConfirmPasswordFields } from '@shared/models/form-fields.model';

export interface PasswordFormData extends ConfirmPasswordFields {
  currentPassword: string;
}

export const PASSWORD_INIT_MODEL: Readonly<PasswordFormData> = {
  currentPassword: '',
  password: '',
  confirmPassword: '',
};
