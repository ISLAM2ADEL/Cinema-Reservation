import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: { '[style.display]': '"block"' },
})
export class Button {
  label = input('');
  iconPath = input('');
  variant = input<'primary' | 'secondary' | 'icon-only'>('primary');
  fullWidth = input(false);
  btnClick = output<void>();

  onClick() {
    this.btnClick.emit();
  }
}
