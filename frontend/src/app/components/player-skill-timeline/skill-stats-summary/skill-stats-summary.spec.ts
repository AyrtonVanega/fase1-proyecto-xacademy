import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillStatsSummary } from './skill-stats-summary';

describe('SkillStatsSummary', () => {
  let component: SkillStatsSummary;
  let fixture: ComponentFixture<SkillStatsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillStatsSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillStatsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
