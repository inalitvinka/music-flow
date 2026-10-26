import { SchemaPathTree } from '@angular/forms/signals';
import { SignupFormData } from '@app/pages/auth/form/models/signup.model';
import { emailSchemaFn } from '@app/shared/schemas/email.schema';
import { confirmPasswordSchemaFn } from '@app/shared/schemas/confirm-password.schema';
import { nameSchemaFn } from '@app/shared/schemas/name.schema';
import { passwordSchemaFn } from '@app/shared/schemas/password.schema';

export const signupSchemaFn = (schemaPath: SchemaPathTree<SignupFormData>) => {
  nameSchemaFn(schemaPath);
  emailSchemaFn(schemaPath);
  passwordSchemaFn(schemaPath);
  confirmPasswordSchemaFn(schemaPath);
};
