import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  resource,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog } from '@shared/components/dialog/dialog';
import { AuthService } from '@core/services/auth/auth-service';
import { PlaylistApiService } from '@core/services/playlist/playlist-api-service';
import { Sprite } from '@shared/components/sprite/sprite';
import { PlaylistForm } from '@shared/components/playlist-form/playlist-form';
import { PluralTextPipe } from '@shared/pipes/plural-text/plural-text-pipe';

@Component({
  selector: 'player-library',
  imports: [PlaylistForm, Dialog, RouterLink, Sprite, PluralTextPipe],
  templateUrl: './library.html',
  styleUrl: './library.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Library {
  private authService = inject(AuthService);
  private playlistApiService = inject(PlaylistApiService);
  protected isModalOpen = signal(false);

  private playlistForm = viewChild<PlaylistForm>('playlistFormRef');

  protected playlistsResource = resource({
    loader: async () => {
      const uid = this.authService.user()?.uid;
      if (!uid) return [];
      return this.playlistApiService.getUserPlaylists(uid);
    },
  });

  protected openCreateForm() {
    this.playlistForm()?.resetForm();
    this.isModalOpen.set(true);
  }

  protected closeCreateForm() {
    this.isModalOpen.set(false);
    this.playlistsResource.reload();
  }
}
