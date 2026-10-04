import { Component, input, output } from '@angular/core';
import { TrackRow } from '@shared/components/track-row/track-row';
import { Sprite } from '@shared/components/sprite/sprite';
import { Button } from '@shared/components/button/button';
import { Track } from '@shared/models/track';

@Component({
  selector: 'player-playlist-recommended',
  imports: [TrackRow, Sprite, Button],
  templateUrl: './playlist-recommended.html',
  styleUrl: './playlist-recommended.scss',
})
export class PlaylistRecommended {
  tracks = input.required<Track[]>();
  isLoading = input(false);

  trackAdd = output<Track>();
  refresh = output();
}
