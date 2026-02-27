import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerImport } from './player-import';

describe('PlayerImport', () => {
  let component: PlayerImport;
  let fixture: ComponentFixture<PlayerImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerImport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerImport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
