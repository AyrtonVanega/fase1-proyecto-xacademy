import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHeader } from './player-header';

describe('PlayerHeader', () => {
  let component: PlayerHeader;
  let fixture: ComponentFixture<PlayerHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
