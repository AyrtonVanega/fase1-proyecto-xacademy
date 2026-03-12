import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PlayerModel } from '../../../models/player';

@Component({
  selector: 'app-player-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-header.html',
  styleUrl: './player-header.scss'
})
export class PlayerHeaderComponent {

  @Input({ required: true })
  player!: PlayerModel;

}
