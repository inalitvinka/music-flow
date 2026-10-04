import { inject, Service } from '@angular/core';
import { JamendoService } from '@api/jamendo/jamendo-service';
import { createKeyByQueryParams } from '@app/shared/utils/object.utils';
import { map, of, tap } from 'rxjs';
import { TrackCacheService } from '../cache/entity-cache';
import {
  JamendoPaginationParams,
  JamendoSearchParams,
  SearchParams,
  JamendoResult,
} from '../jamendo/jamendo.types';
import { createJamendoResponseHandler } from '../jamendo/utils/handle-jamendo-response';
import { mapSearchParamsToJamendoSearchParams } from '../jamendo/utils/map-search-params-to-jamendo';
import { TrackDto } from './track.dto';
import { mapTrack } from './track.mapper';
import { Track } from './track.model';

@Service()
export class TrackService {
  private jamendoService = inject(JamendoService);
  private cache = inject(TrackCacheService);

  private responseHandler = createJamendoResponseHandler(mapTrack);

  getPopular(params?: JamendoPaginationParams) {
    const queryParams = {
      ...params,
      order: 'popularity_month',
    };
    return this.searchRaw(queryParams);
  }

  getNewReleases(params?: JamendoPaginationParams) {
    const queryParams = {
      ...params,
      order: 'releasedate_desc',
    };
    return this.searchRaw(queryParams);
  }

  search(params: SearchParams) {
    const jamendoParams = mapSearchParamsToJamendoSearchParams(params);
    return this.searchRaw(jamendoParams);
  }

  searchRaw(params: JamendoSearchParams) {
    const queryParams = {
      ...params,
      fullcount: true,
      include: 'stats+musicinfo',
    };
    const key = createKeyByQueryParams(queryParams, 'search');

    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    return this.jamendoService.get<TrackDto>('tracks', queryParams).pipe(
      map(this.responseHandler),
      tap((resp) => {
        this.cache.set(key, resp);
      })
    );
  }

  getTracksByIds(ids: string[]) {
    if (!ids.length) return of([]);
    const queryParams = {
      id: ids.join('+'),
      include: 'stats+musicinfo',
      limit: 100,
    };
    const key = createKeyByQueryParams(queryParams, 'search');
    if (this.cache.has(key)) {
      const cachedResponse = this.cache.get(key) as JamendoResult<Track>;
      const tracks = cachedResponse.results ?? [];
      return of(this.sortTracksByIds(tracks, ids));
    }
    return this.jamendoService.get<TrackDto>('tracks', queryParams).pipe(
      map(this.responseHandler),
      tap((resp) => {
        this.cache.set(key, resp);
      }),
      map((resp: JamendoResult<Track>) => this.sortTracksByIds(resp.results ?? [], ids))
    );
  }

  private sortTracksByIds(tracks: Track[], ids: string[]): Track[] {
    return [...tracks].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  }
}
