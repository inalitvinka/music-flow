import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  resource,
  signal,
  computed,
  ElementRef,
  effect,
} from '@angular/core';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  CdkDragPreview,
} from '@angular/cdk/drag-drop';
import { TrackService } from '@core/api/track/track-service';
import { PlaylistApiService } from '@core/services/playlist/playlist-api-service';
import { ToastService } from '@core/services/toast/toast-service';
import { JamendoResult } from '@core/api/jamendo/jamendo.types';
import { JAMENDO_MAIN_GENRES } from '@core/api/jamendo/jamendo.constants';
import { DurationPipe } from '@shared/pipes/duration-pipe';
import { TrackRow } from '@shared/components/track-row/track-row';
import { Sprite } from '@shared/components/sprite/sprite';
import { Button } from '@shared/components/button/button';
import { Dialog } from '@shared/components/dialog/dialog';
import { PlaylistForm } from '@shared/components/playlist-form/playlist-form';
import { ContextMenu } from '@shared/components/context-menu/context-menu';
import { Track } from '@shared/models/track';
import { UpdatePlaylistInput } from '@shared/models/firestore.model';
import { PlaylistHeader } from './components/playlist-header/playlist-header';
import { TracksHeader } from './components/tracks-header/tracks-header';
import { PlaylistSearch } from './components/playlist-search/playlist-search';
import { PlaylistRecommended } from './components/playlist-recommended/playlist-recommended';
import {
  MIN_SEARCH_LENGTH,
  RECOMMEND_DISPLAY_LIMIT,
  MOSAIC_COVERS_COUNT,
  DUE_TIME,
  RECOMMEND_REQUEST_LIMIT,
  RECOMMEND_MAX_OFFSET,
} from './playlist.const';

@Component({
  selector: 'player-playlist',
  imports: [
    TrackRow,
    DurationPipe,
    Sprite,
    Button,
    Dialog,
    PlaylistForm,
    PlaylistHeader,
    TracksHeader,
    CdkDrag,
    CdkDropList,
    CdkDragPreview,
    ContextMenu,
    PlaylistSearch,
    PlaylistRecommended,
  ],
  templateUrl: './playlist.html',
  styleUrl: './playlist.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Playlist {
  private trackService = inject(TrackService);
  private playlistService = inject(PlaylistApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private elementRef = inject(ElementRef);

  protected id = input.required<string>();

  protected isPlaying = signal(false);

  protected isDeleteModalOpen = signal(false);
  protected isEditModalOpen = signal(false);

  protected stableTracks = signal<Track[]>([]);
  protected stableRecommendedTracks = signal<Track[]>([]);

  protected recommendOffset = signal(0);

  protected isSearchOpen = signal(false);
  protected searchQuery = signal('');

  protected playlistColor = signal('var(--color-accent)');

  protected totalTime = computed(() => {
    const tracks = this.tracksResource.value() ?? [];
    return tracks.reduce((acc, item) => acc + (item.duration ?? 0), 0);
  });

  protected trackIds = computed(() => {
    return this.playlistResource.value()?.trackIds ?? [];
  });

  protected filteredSearchResults = computed(() => {
    const foundTracks = this.searchResultResource.value() ?? [];
    const currentIds = new Set(this.trackIds());
    return foundTracks.filter((track) => !currentIds.has(track.id));
  });

  protected playlistResource = resource({
    loader: () => {
      return this.playlistService.getPlaylistById(this.id());
    },
  });

  protected tracksResource = rxResource({
    params: () => this.trackIds(),
    stream: ({ params: trackIds }) => {
      if (!trackIds.length) {
        return of([]);
      }
      return this.trackService.getTracksByIds(trackIds);
    },
  });

  protected recommendedTracksResource = rxResource({
    params: () => {
      const initOffset = this.recommendOffset();
      const trackIds = this.trackIds();

      const pageIndex = initOffset / RECOMMEND_REQUEST_LIMIT;
      const genreIndex = pageIndex % JAMENDO_MAIN_GENRES.length;

      const seed = JAMENDO_MAIN_GENRES[genreIndex];
      const offset = initOffset + trackIds.length;

      return {
        seed,
        trackIds,
        offset,
      };
    },
    stream: ({ params }) => {
      const { seed, trackIds, offset } = params;
      return this.trackService
        .searchRaw({
          search: seed,
          order: 'popularity_month',
          offset,
          limit: RECOMMEND_REQUEST_LIMIT,
        })
        .pipe(
          map((response: JamendoResult<Track>) => {
            const allTracks = response.results ?? [];
            const idSet = new Set(trackIds);
            return allTracks
              .filter((track) => !idSet.has(track.id))
              .slice(0, RECOMMEND_DISPLAY_LIMIT);
          })
        );
    },
  });

  protected searchResultResource = rxResource({
    params: () => this.searchQuery(),
    stream: ({ params: searchQuery }) => {
      if (!searchQuery || searchQuery.trim().length < MIN_SEARCH_LENGTH) {
        return of([]);
      }
      return of(searchQuery).pipe(
        debounceTime(DUE_TIME),
        distinctUntilChanged(),
        switchMap((query) => this.trackService.searchRaw({ search: query })),
        map((resp) => resp.results ?? [])
      );
    },
  });

  constructor() {
    effect(() => {
      const color = this.playlistColor();
      this.elementRef.nativeElement.style.setProperty('--playlist-color', color);
    });
    effect(() => {
      const tracks = this.tracksResource.value();
      if (tracks && tracks.length) {
        this.stableTracks.set(tracks);
      }
    });

    effect(() => {
      const recommended = this.recommendedTracksResource.value();
      if (Array.isArray(recommended)) {
        this.stableRecommendedTracks.set(recommended);
      }
    });
  }

  protected refreshRecommendations() {
    this.recommendOffset.update((current) => {
      if (current >= RECOMMEND_MAX_OFFSET) return 0;
      return current + RECOMMEND_REQUEST_LIMIT;
    });
  }

  protected getPlaylistColor(hex: string) {
    return this.playlistColor.set(hex);
  }

  protected toggleFindButton() {
    this.isSearchOpen.update((open) => !open);
    if (!this.isSearchOpen()) {
      this.searchQuery.set('');
    }
  }

  private buildCover(tracks: Track[]) {
    if (!tracks.length) return [];
    if (tracks.length >= MOSAIC_COVERS_COUNT) {
      return tracks.slice(0, MOSAIC_COVERS_COUNT).map((t) => t.album.image);
    }
    return [tracks[0].album.image];
  }

  private async saveTracks(playlistId: string, tracks: Track[]) {
    const updates: UpdatePlaylistInput = {
      trackIds: tracks.map((t) => t.id),
      coverUrl: this.buildCover(tracks),
    };
    await this.playlistService.updatePlaylist(playlistId, updates);
    this.playlistResource.reload();
  }

  private addTracks(tracks: Track[], track: Track) {
    return [...tracks, track];
  }

  private removeTrack(tracks: Track[], track: Track) {
    return tracks.filter((t) => t.id !== track.id);
  }

  private reorderTracks(tracks: Track[], from: number, to: number) {
    const copy = [...tracks];
    moveItemInArray(copy, from, to);
    return copy;
  }

  // THINK ABOUT: dropTrack/addToPlaylist/removeFromPlaylist are three diff ways to get the new Track[] => SSOT
  protected async dropTrack(event: CdkDragDrop<string[]>) {
    const playlist = this.playlistResource.value();
    if (!playlist) return;

    if (event.previousIndex === event.currentIndex) return;

    const currentTracks = this.stableTracks();
    const nextTracks = this.reorderTracks(currentTracks, event.previousIndex, event.currentIndex);

    try {
      await this.saveTracks(playlist.id, nextTracks);
    } catch (error) {
      console.error('[dropTrack]', error);
    }
  }

  protected async addToPlaylist(track: Track) {
    const playlist = this.playlistResource.value();
    if (!playlist) return;

    const currentTracks = this.stableTracks();
    const nextTracks = this.addTracks(currentTracks, track);

    try {
      await this.saveTracks(playlist.id, nextTracks);
    } catch (error) {
      console.error('[addToPlaylist]', error);
    }
  }

  protected async removeFromPlaylist(track: Track) {
    const playlist = this.playlistResource.value();
    if (!playlist) return;

    const currentTracks = this.stableTracks();

    if (currentTracks.length === 1) {
      this.toast.info('A playlist must contain at least one track.');
      return;
    }

    const nextTracks = this.removeTrack(currentTracks, track);

    try {
      await this.saveTracks(playlist.id, nextTracks);
    } catch (error) {
      console.error('[removeFromPlaylist]', error);
    }
  }

  protected playPlaylist() {
    this.isPlaying.update((value) => !value);
  }

  protected editPlaylistDetails() {
    this.isEditModalOpen.set(true);
  }

  protected closeEditForm() {
    this.isEditModalOpen.set(false);
    this.playlistResource.reload();
  }

  protected confirmDeletePlaylist() {
    this.isDeleteModalOpen.set(true);
  }

  protected async deletePlaylist() {
    const playlistId = this.playlistResource.value()?.id;
    if (!playlistId) return;
    try {
      this.isDeleteModalOpen.set(false);
      await this.playlistService.deletePlaylist(playlistId);
      this.toast.success(`Playlist was successfully deleted`);
      await this.router.navigate(['/library']);
    } catch (error) {
      console.error('[deletePlaylistById]', error);
    }
  }
}
