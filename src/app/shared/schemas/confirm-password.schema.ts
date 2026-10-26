import { SchemaPathTree, validate } from '@angular/forms/signals';
import { ValidationMessage } from '@shared/constants/validation';
import { ConfirmPasswordFields } from '@shared/models/form-fields.model';

export const confirmPasswordSchemaFn = (schemaPath: SchemaPathTree<ConfirmPasswordFields>) => {
  validate(schemaPath.confirmPassword, ({ value, valueOf }) => {
    if (value() !== valueOf(schemaPath.password)) {
      return {
        kind: 'confirm',
        message: ValidationMessage.PasswordMismatch,
      };
    }
    return null;
  });
};
