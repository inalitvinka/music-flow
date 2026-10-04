import { Component, signal, input, output } from '@angular/core';
import { TuiInput, TuiButtonX } from '@taiga-ui/core';
import { TrackRow } from '@shared/components/track-row/track-row';
import { Button } from '@shared/components/button/button';
import { Sprite } from '@shared/components/sprite/sprite';
import { Track } from '@shared/models/track';

const MIN_SEARCH_LENGTH = 2;

@Component({
  selector: 'player-playlist-search',
  imports: [TuiInput, TuiButtonX, TrackRow, Button, Sprite],
  templateUrl: './playlist-search.html',
  styleUrl: './playlist-search.scss',
})
export class PlaylistSearch {
  tracks = input.required<Track[]>();
  isLoading = input(false);
  queryChange = output<string>();
  trackAdd = output<Track>();
  closeSearch = output<void>();

  protected readonly MIN_SEARCH_LENGTH = MIN_SEARCH_LENGTH;

  protected searchQuery = signal('');

  protected onInput(text: string) {
    this.searchQuery.set(text);
    this.queryChange.emit(text);
  }

  protected clearSearchInput() {
    this.searchQuery.set('');
    this.queryChange.emit('');
  }
}
