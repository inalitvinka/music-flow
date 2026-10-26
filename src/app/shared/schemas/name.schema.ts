import { SchemaPathTree, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { Regex, ValidationMessage } from '@app/shared/constants/validation';

const NAME_MIN_LEN = 2;
const NAME_MAX_LEN = 50;

export const nameSchemaFn = (schemaPath: SchemaPathTree<{ name: string }>) => {
  required(schemaPath.name, {
    message: ValidationMessage.Required,
  });
  pattern(schemaPath.name, Regex.HasNoEdgeSpaces, {
    message: ValidationMessage.NoEdgeSpaces,
  });
  pattern(schemaPath.name, Regex.IsValidName, {
    message: ValidationMessage.InvalidName,
  });
  minLength(schemaPath.name, NAME_MIN_LEN, {
    message: ValidationMessage.MinLen(NAME_MIN_LEN),
  });
  maxLength(schemaPath.name, NAME_MAX_LEN, {
    message: ValidationMessage.MaxLen(NAME_MAX_LEN),
  });
};
