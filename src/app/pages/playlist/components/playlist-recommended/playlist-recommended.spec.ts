import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRecommended } from './playlist-recommended';

describe('PlaylistRecommended', () => {
  let component: PlaylistRecommended;
  let fixture: ComponentFixture<PlaylistRecommended>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistRecommended],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistRecommended);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
