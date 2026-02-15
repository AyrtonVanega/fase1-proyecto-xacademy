import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface SkillFieldConfig {
  key: string;
  label: string;
  min: number;
  max: number;
}

@Component({
  selector: 'app-skills-editor',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './skills-editor.html',
  styleUrl: './skills-editor.scss'
})
export class SkillsEditorComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) skillGroups!: any[];
  @Input() isEditing: boolean = false;

}
