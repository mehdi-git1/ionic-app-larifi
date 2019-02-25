import { Component, Input } from '@angular/core';

@Component({
  selector: 'edospnc-expandable-block',
  templateUrl: 'edospnc-expandable-block.html'
})
export class EdospncExpandableBlockComponent {

  matPanelHeaderHeight = '48px';

  @Input() title: string;

  @Input() emptyCondition: boolean;

  constructor() {
  }

 }
