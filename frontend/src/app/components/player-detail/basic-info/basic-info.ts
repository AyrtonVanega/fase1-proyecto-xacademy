import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface BasicFieldConfig {
  key: string;
  label: string;
  type: string;
  min?: number;
  max?: number;
  readonly?: boolean;
}

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './basic-info.html',
  styleUrl: './basic-info.scss'
})
export class BasicInfoComponent {

  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) fields!: BasicFieldConfig[];
  @Input() isEditing: boolean = false;

}
