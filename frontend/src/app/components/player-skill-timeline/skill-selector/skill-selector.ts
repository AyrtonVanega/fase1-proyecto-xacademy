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

  openGroup: string | null = null;

  isSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }

  onToggle(skill: string): void {
    this.skillToggle.emit(skill);
  }

  toggleGroup(groupTitle: string) {
    this.openGroup = this.openGroup === groupTitle ? null : groupTitle;
  }

  isOpen(groupTitle: string): boolean {
    return this.openGroup === groupTitle;
  }

  trackByGroup(_: number, group: SkillGroupConfig): string {
    return group.title;
  }

  trackBySkill(_: number, skill: string): string {
    return skill;
  }

}
