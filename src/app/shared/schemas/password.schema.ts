import { SchemaPathTree, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { Regex, ValidationMessage } from '@app/shared/constants/validation';

const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 15;

export const passwordSchemaFn = (schemaPath: SchemaPathTree<{ password: string }>) => {
  required(schemaPath.password, {
    message: ValidationMessage.Required,
  });
  pattern(schemaPath.password, Regex.HasNoSpaces, {
    message: ValidationMessage.NoSpaces,
  });
  pattern(schemaPath.password, Regex.HasLetter, {
    message: ValidationMessage.NeedLetter,
  });
  pattern(schemaPath.password, Regex.HasDigit, {
    message: ValidationMessage.NeedDigit,
  });
  pattern(schemaPath.password, Regex.HasSpecial, {
    message: ValidationMessage.NeedSpecial,
  });
  minLength(schemaPath.password, PASSWORD_MIN_LEN, {
    message: ValidationMessage.MinLen(PASSWORD_MIN_LEN),
  });
  maxLength(schemaPath.password, PASSWORD_MAX_LEN, {
    message: ValidationMessage.MaxLen(PASSWORD_MAX_LEN),
  });
};
