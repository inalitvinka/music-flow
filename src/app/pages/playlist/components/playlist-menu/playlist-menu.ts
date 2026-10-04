import { Component, output } from '@angular/core';
import { Sprite } from '@shared/components/sprite/sprite';
import { ContextMenu } from '@shared/components/context-menu/context-menu';

@Component({
  selector: 'player-playlist-menu',
  imports: [Sprite, ContextMenu],
  templateUrl: './playlist-menu.html',
  styleUrl: './playlist-menu.scss',
})
export class PlaylistMenu {
  editClicked = output<void>();
  deleteClicked = output<void>();
}
