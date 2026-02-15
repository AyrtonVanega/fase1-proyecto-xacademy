import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsEditor } from './skills-editor';

describe('SkillsEditor', () => {
  let component: SkillsEditor;
  let fixture: ComponentFixture<SkillsEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
