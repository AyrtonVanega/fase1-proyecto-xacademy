import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SkillGroupConfig } from '../../../config/player-skill';

@Component({
  selector: 'app-skill-selector',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './skill-selector.html',
  styleUrl: './skill-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillSelectorComponent {

  @Input() skillGroups!: SkillGroupConfig[];
  @Input() selectedSkills: string[] = [];

  @Output() skillToggle = new EventEmitter<string>();

  isSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }

  onToggle(skill: string): void {
    this.skillToggle.emit(skill);
  }

  trackByGroup(_: number, group: SkillGroupConfig): string {
    return group.title;
  }

  trackBySkill(_: number, skill: string): string {
    return skill;
  }

}
