import { Pipe, PipeTransform } from '@angular/core';
import { TextVariant, PLURAL_MAP } from '@app/shared/constants/plural-text-pipe.const';

@Pipe({
  name: 'pluralText',
})
export class PluralTextPipe implements PipeTransform {
  transform(count: number, variant: TextVariant) {
    const rules = PLURAL_MAP[variant];
    if (!rules) return '';
    return count === 1 ? rules.one : rules.many;
  }
}
