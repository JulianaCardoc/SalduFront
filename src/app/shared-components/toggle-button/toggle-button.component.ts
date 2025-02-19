import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';


@Component({
    selector: 'app-toggle-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toggle-button.component.html',
    styleUrl: './toggle-button.component.css'
})
export class ToggleButtonComponent {
    @Input() checked = false;
    @Input() direction: 'row' | 'col' = 'row';
    @Output() toggleStatus = new EventEmitter<void>();

    onToggle() {
        this.toggleStatus.emit();
    }

    mapDirections = {
        row: {
          'flex': true,
          'flex-row': true,
          'gap-2': true,
        },
        col: {
          'flex': true,
          'flex-col': true,
          'gap-2': true,
          'justify-center': true,
        },
      };
    
      get directions() {
        const direction = this.mapDirections[this.direction];
          return direction;
      }
}
