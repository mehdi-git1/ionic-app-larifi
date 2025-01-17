import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'work-rate-circle',
  templateUrl: 'work-rate-circle.component.html',
  styleUrls: ['./work-rate-circle.component.scss']
})

export class WorkRateCircleComponent implements OnChanges {

  @Input() workRate: number;
  @Input() diameter: number;
  @Input() strokeWidth: number;
  @Input() isTaf: boolean;

  radius: number;
  center: number;
  circumference: number;
  offset: number;

  ngOnChanges() {
    this.initWorkRateCircle();
  }

  /**
   * instancie les paramètres necessaire à l'affichage du work rate circle
   */
  initWorkRateCircle() {
    this.radius = (this.diameter / 2) - this.strokeWidth;
    this.center = this.diameter / 2;
    this.circumference = this.radius * 2 * Math.PI;
    this.offset = this.circumference - this.workRate / 100 * this.circumference;
  }
}
