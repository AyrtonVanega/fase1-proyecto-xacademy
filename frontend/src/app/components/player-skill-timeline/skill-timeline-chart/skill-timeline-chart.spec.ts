import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTimelineChart } from './skill-timeline-chart';

describe('SkillTimelineChart', () => {
  let component: SkillTimelineChart;
  let fixture: ComponentFixture<SkillTimelineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillTimelineChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillTimelineChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
