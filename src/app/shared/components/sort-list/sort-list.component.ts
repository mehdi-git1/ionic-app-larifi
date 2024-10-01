import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortDirection } from '../../../core/enums/sort-direction-enum';

export interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'sort-list',
  templateUrl: 'sort-list.component.html',
  styleUrls: ['./sort-list.component.scss']
})
export class SortListComponent implements OnInit {

  @Input() value: string;
  @Input() options: Array<SortOption>;
  @Input() direction: SortDirection = SortDirection.ASC;
  @Input() disableSort = false;
  @Output() sortChange = new EventEmitter<SortChange>();

  isPopoverOpen = false;
  selectedOptionLabel: string = '';
  popoverEvent: any;  // Declare popoverEvent here to capture the button click event

  ngOnInit() {
    if (!this.value && this.options.length) {
      this.value = this.options[0].value;
      this.selectedOptionLabel = this.options[0].label;
    }
    if (!this.direction) {
      this.direction = SortDirection.ASC;
    }

    this.updateSelectedOptionLabel();
  }

  openPopover(event: any) {
    this.popoverEvent = event;  // Capture the button click event to align the popover
    this.isPopoverOpen = true;  // Open the popover
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  changeSort(newValue: string) {
    this.value = newValue;
    this.direction = SortDirection.ASC;
    this.updateSelectedOptionLabel();
    this.sortChange.emit({ value: this.value, direction: this.direction });
    this.closePopover();
  }     
 
  changeSortDirection(newDirection: SortDirection) {
    this.direction = newDirection;
    this.sortChange.emit({ value: this.value, direction: this.direction });
  }

  private updateSelectedOptionLabel() {
    const selectedOption = this.options.find(option => option.value === this.value);
    if (selectedOption) {
      this.selectedOptionLabel = selectedOption.label;
    }
  }
}

export interface SortChange {
  value: string;
  direction: SortDirection;
}
