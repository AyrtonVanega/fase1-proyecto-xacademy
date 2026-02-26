import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSkillTimeline } from './player-skill-timeline';

describe('PlayerSkillTimeline', () => {
  let component: PlayerSkillTimeline;
  let fixture: ComponentFixture<PlayerSkillTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSkillTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSkillTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
