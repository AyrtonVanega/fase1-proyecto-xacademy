import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-import-result-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-result-modal.html',
  styleUrl: './import-result-modal.scss'
})
export class ImportResultModalComponent {

  @Input() result: any;
  @Input() error: string | null = null;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
