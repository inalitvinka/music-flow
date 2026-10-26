import { required, SchemaPathTree } from '@angular/forms/signals';
import { ValidationMessage } from '@app/shared/constants/validation';
import { emailSchemaFn } from '@app/shared/schemas/email.schema';
import { LoginFormData } from '../form/models/login.model';

export const loginSchemaFn = (schemaPath: SchemaPathTree<LoginFormData>) => {
  emailSchemaFn(schemaPath);

  required(schemaPath.password, {
    message: ValidationMessage.Required,
  });
};
