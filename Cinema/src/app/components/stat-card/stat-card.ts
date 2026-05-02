import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  @Input() iconUrl !: string;
  @Input() stat !: string;
  @Input() statNumber !: string;
  @Input() statAmount !: string;
  @Input() upOrDownIconUrl !: string;
}
