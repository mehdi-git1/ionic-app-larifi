import { Component, Input } from '@angular/core';

@Component({
  selector: 'color-number-dot',
  templateUrl: 'color-number-dot.html'
})
export class ColorNumberDotComponent {

  @Input() numberText: string;

  constructor() {
  }

  /**
   * Détermine la classe à utiliser en fonction du texte
   *
   * @return la classe à utiliser
   */
  getNumberDotColorClass(): string {
    if (this.numberText == '1') {
      return 'number-dot-1';
    } else if (this.numberText == '2') {
      return 'number-dot-2';
    } else if (this.numberText == '3' || this.numberText == 'C') {
      return 'number-dot-3';
    } else if (this.numberText == '4') {
      return 'number-dot-4';
    } else {
      return 'number-dot-default';
    }
  }
 }
