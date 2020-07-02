import { Component, OnInit, Input } from '@angular/core';
import { TrainingLabelModel } from 'src/app/core/models/dwh-history/Training-Label.model';

@Component({
  selector: 'training-history',
  templateUrl: './training-history.component.html',
  styleUrls: ['./training-history.component.scss'],
})
export class TrainingHistoryComponent implements OnInit {

  @Input()
  trainingHistory: TrainingLabelModel[];

  constructor() { }

  ngOnInit() {

  }

}
