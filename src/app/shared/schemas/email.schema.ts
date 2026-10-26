import { SchemaPathTree, pattern, required } from '@angular/forms/signals';
import { Regex, ValidationMessage } from '@app/shared/constants/validation';

export const emailSchemaFn = (schemaPath: SchemaPathTree<{ email: string }>) => {
  required(schemaPath.email, {
    message: ValidationMessage.Required,
  });
  pattern(schemaPath.email, Regex.IsValidEmail, {
    message: ValidationMessage.InvalidEmail,
  });
};
