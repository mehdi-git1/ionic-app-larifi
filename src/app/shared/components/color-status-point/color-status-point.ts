import { Component, Input } from '@angular/core';

@Component({
  selector: 'color-status-point',
  templateUrl: 'color-status-point.html'
})
export class ColorStatusPointComponent {

  /**
   * Peut prendre les valeurs : red, green, orange, yellow
   */
  @Input() colorClass: string;

  constructor() {
  }

  getColorClass(): string {
    return this.colorClass;
  }

 }
