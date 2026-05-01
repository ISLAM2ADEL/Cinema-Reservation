import { Component } from '@angular/core';
import { signal } from '@angular/core';
import { Seat } from "../../components/seat/seat";

@Component({
  selector: 'app-seats',
  imports: [Seat],
  templateUrl: './seats.html',
  styleUrl: './seats.css',
})
export class Seats {
  seats = signal(
    Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      isTaken: Math.random() > 0.7,
    }))
  );
}
