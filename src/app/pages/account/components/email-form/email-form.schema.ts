import { emailPasswordSchemaFn } from '@shared/schemas/emailPasswordSchemaFn.schema';
import { emailMustDifferSchemaFn } from '@shared/schemas/email-must-differ.schema';
import { SchemaPathTree } from '@angular/forms/signals';
import { EmailFormData } from './email-form.model';

type CurrentEmail = string | null | undefined;

export const emailFormSchemaFn = (
  schemaPath: SchemaPathTree<EmailFormData>,
  currentEmail: CurrentEmail
) => {
  emailPasswordSchemaFn(schemaPath);
  if (!currentEmail) return;
  emailMustDifferSchemaFn(schemaPath, currentEmail);
};
