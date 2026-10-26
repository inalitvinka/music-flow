import { required, SchemaPathTree } from '@angular/forms/signals';
import { ValidationMessage } from '@shared/constants/validation';
import { EmailPasswordFields } from '@shared/models/form-fields.model';
import { emailSchemaFn } from '@shared/schemas/email.schema';

export const emailPasswordSchemaFn = (schemaPath: SchemaPathTree<EmailPasswordFields>) => {
  emailSchemaFn(schemaPath);

  required(schemaPath.password, {
    message: ValidationMessage.Required,
  });
};
