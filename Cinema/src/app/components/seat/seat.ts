import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat.html',
  styleUrl: './seat.css',
})
export class Seat {
  @Input() isTaken = false;
  isSelected = false; 

  toggleSeat() {
    if (!this.isTaken) {
      this.isSelected = !this.isSelected;
    }
  }
}
