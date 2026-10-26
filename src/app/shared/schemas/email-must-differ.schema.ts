import { SchemaPathTree, validate } from '@angular/forms/signals';
import { Email } from '@shared/models/form-fields.model';
import { ValidationMessage } from '../constants/validation';

export const emailMustDifferSchemaFn = (
  schemaPath: SchemaPathTree<Email>,
  currentEmail: string
) => {
  validate(schemaPath.email, ({ value }) => {
    if (value() === currentEmail) {
      return {
        kind: 'sameAsCurrentEmail',
        message: ValidationMessage.EmailMustDiffer,
      };
    }
    return null;
  });
};
