import { SchemaPathTree, required } from '@angular/forms/signals';
import { ValidationMessage } from '@shared/constants/validation';

export const deleteAccountSchemaFn = (schemaPath: SchemaPathTree<{ password: string }>) => {
  required(schemaPath.password, {
    message: ValidationMessage.Required,
  });
};
