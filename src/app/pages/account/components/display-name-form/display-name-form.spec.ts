import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNameForm } from './display-name-form';

describe('DisplayNameForm', () => {
  let component: DisplayNameForm;
  let fixture: ComponentFixture<DisplayNameForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayNameForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayNameForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
