import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsAnalysis } from './skills-analysis';

describe('SkillsAnalysis', () => {
  let component: SkillsAnalysis;
  let fixture: ComponentFixture<SkillsAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
