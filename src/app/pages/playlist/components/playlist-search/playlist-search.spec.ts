import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSearch } from './playlist-search';

describe('PlaylistSearch', () => {
  let component: PlaylistSearch;
  let fixture: ComponentFixture<PlaylistSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
