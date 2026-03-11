import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-player-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './delete-player-modal.html',
  styleUrl: './delete-player-modal.scss'
})
export class DeletePlayerModalComponent {

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
