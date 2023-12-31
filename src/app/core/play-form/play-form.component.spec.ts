import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayFormComponent } from './play-form.component';

describe('PlayFormComponent', () => {
  let component: PlayFormComponent;
  let fixture: ComponentFixture<PlayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
