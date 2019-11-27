import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'work-rate-circle',
  templateUrl: 'work-rate-circle.component.html',
  styleUrls: ['./work-rate-circle.component.scss']
})

export class WorkRateCircleComponent implements OnInit {

  @Input() workRate: number;
  @Input() diameter: number;
  @Input() strokeWidth: number;

  radius: number;
  center: number;
  circumference: number;
  offset: number;

  ngOnInit() {
    this.radius = (this.diameter / 2) - this.strokeWidth;
    this.center = this.diameter / 2;
    this.circumference = this.radius * 2 * Math.PI;
    this.offset = this.circumference - this.workRate / 100 * this.circumference;
  }

}
