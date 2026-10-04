import { Component, signal, input } from '@angular/core';
import { TuiDropdown, TuiDataList } from '@taiga-ui/core';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { Sprite } from '../sprite/sprite';

@Component({
  selector: 'player-context-menu',
  imports: [TuiDropdown, TuiDataList, TuiActiveZone, TuiObscured, Sprite],
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.scss',
})
export class ContextMenu {
  triggerIcon = input<string>('menu-kebab-vert');
  size = input<'small' | 'large'>('small');

  protected isDropdownOpen = signal(false);

  protected onDotsClick(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update((open) => !open);
  }

  protected close() {
    this.isDropdownOpen.set(false);
  }

  protected onActiveZone(active: boolean) {
    if (!active) {
      this.isDropdownOpen.set(false);
    }
  }

  protected onObscured(obscured: boolean) {
    if (obscured) {
      this.isDropdownOpen.set(false);
    }
  }
}
