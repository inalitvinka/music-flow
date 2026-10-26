import { EmailPasswordFields } from '@shared/models/form-fields.model';

export type EmailFormData = EmailPasswordFields;

export const EMAIL_FORM_INIT_MODEL: Readonly<EmailFormData> = {
  email: '',
  password: '',
};
