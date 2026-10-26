import { SchemaPathTree, required, validate } from '@angular/forms/signals';
import { passwordSchemaFn } from '@shared/schemas/password.schema';
import { confirmPasswordSchemaFn } from '@shared/schemas/confirm-password.schema';
import { ValidationMessage } from '@shared/constants/validation';
import { PasswordFormData } from './password-form.model';

export const changePasswordSchemaFn = (schemaPath: SchemaPathTree<PasswordFormData>) => {
  passwordSchemaFn(schemaPath);
  confirmPasswordSchemaFn(schemaPath);
  required(schemaPath.currentPassword, {
    message: ValidationMessage.Required,
  });
  validate(schemaPath.password, ({ value, valueOf }) => {
    if (value() === valueOf(schemaPath.currentPassword)) {
      return {
        kind: 'sameAsCurrentPassword',
        message: ValidationMessage.PasswordMustDiffer,
      };
    }

    return null;
  });
};
