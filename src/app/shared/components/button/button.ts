/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { ComponentSize, ComponentVariant } from '@app/shared/models/types/ui.types';
import { Sprite } from '../sprite/sprite';

type ButtonType = HTMLButtonElement['type'];

@Component({
  selector: 'button[playerButton]',
  imports: [Sprite],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.btn]': 'true',
    '[class.base]': 'variant() === "base"',
    '[class.primary]': 'variant() === "primary"',
    '[class.secondary]': 'variant() === "secondary"',
    '[class.danger]': 'variant() === "danger"',
    '[class.small]': 'size() === "small"',
    '[class.loading]': 'loading()',
    '[disabled]': 'disabled() || loading()',
    '[type]': 'buttonType',
    '[class]': 'playerButton()',
  },
})
export class Button {
  private host = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected spinnerPath = 'assets/images/spinner.gif';

  playerButton = input<string>();

  private type = this.host.nativeElement.getAttribute('type');
  protected buttonType: ButtonType = this.type ? (this.type as ButtonType) : 'button';

  variant = input<ComponentVariant>('primary');
  size = input<ComponentSize>('medium');
  disabled = input(false);
  loading = input(false);
  icon = input('');
}
