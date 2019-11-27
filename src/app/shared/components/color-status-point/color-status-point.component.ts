import { Component, Input } from '@angular/core';

@Component({
  selector: 'color-status-point',
  templateUrl: 'color-status-point.component.html',
  styleUrls: ['./color-status-point.component.scss']
})
export class ColorStatusPointComponent {

  /**
   * Peut prendre les valeurs : red, green, orange, yellow
   */
  @Input() colorClass: string;

  constructor() {
  }

}
