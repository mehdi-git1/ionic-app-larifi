import { Component, Input } from '@angular/core';

@Component({
  selector: 'edospnc-expandable-block',
  templateUrl: 'edospnc-expandable-block.html'
})
export class EdospncExpandableBlockComponent {

  matPanelHeaderHeight = '48px';

  @Input() title: string;

  @Input() emptyCondition: boolean;

  @Input() hideToggle: boolean = false;

  @Input() expanded: boolean = true;

  constructor() {
  }

  isExpandedByDefault(): boolean {
    if (this.hideToggle) {
      return true;
    }
    return this.expanded;
  }

  isDisabled(): boolean {
    return this.hideToggle;
  }

 }
