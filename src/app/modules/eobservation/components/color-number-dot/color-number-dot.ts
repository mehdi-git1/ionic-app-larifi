import { Component, Input } from '@angular/core';

@Component({
  selector: 'color-number-dot',
  templateUrl: 'color-number-dot.html'
})
export class ColorNumberDotComponent {

  @Input() numberText: string;

  constructor() {
  }
  getNumberDotColorClass(): string {
    if (this.numberText == '1') {
      return 'number-dot-1';
    } else if (this.numberText == '2') {
      return 'number-dot-2';
    } else if (this.numberText == '3') {
      return 'number-dot-3';
    } else if (this.numberText == '4') {
      return 'number-dot-4';
    } else {
      return 'number-dot-default';
    }
  }
 }
