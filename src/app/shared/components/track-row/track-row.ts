import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Track } from '@shared/models/track';
import { TrackCover } from '../track-cover/track-cover';

@Component({
  selector: 'player-track-row',
  imports: [TrackCover],
  templateUrl: './track-row.html',
  styleUrl: './track-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.playing]': 'isPlaying()',
    '[class.hovered]': 'isHovered()',
  },
})
export class TrackRow {
  track = input.required<Track>();
  index = input<number | null>(null);

  isPlaying = input(false);

  protected isHovered = signal(false);

  playClicked = output<Track>();
}
