import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'statutory-reporting-stage',
  templateUrl: 'statutory-reporting-stage.html'
})
export class StatutoryReportingStageComponent implements OnInit {

  @Input() stagesList;

  constructor() {

  }

  ngOnInit() {

  }
}
