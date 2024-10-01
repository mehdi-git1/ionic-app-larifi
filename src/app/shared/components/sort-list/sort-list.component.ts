import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SortDirection } from '../../../core/enums/sort-direction-enum';

/**
 * Interface defining the structure of each sorting option.
 */
export interface SortOption {
  value: string;   // The actual value used for sorting
  label: string;   // The label displayed to the user
}

@Component({
  selector: 'sort-list',
  templateUrl: 'sort-list.component.html',
  styleUrls: ['./sort-list.component.scss']
})
export class SortListComponent implements OnInit {

  @Input() value: string;  // Current sort option value
  @Input() options: Array<SortOption>;  // List of sorting options
  @Input() direction: SortDirection = SortDirection.ASC;  // Default sorting direction
  @Input() disableSort = false;  // Disable sorting options
  @Output() sortChange = new EventEmitter<SortChange>();  // Event emitter for sort changes

  isPopoverOpen = false;  // Control the visibility of the custom popover
  selectedOptionLabel: string = '';  // To show the selected label in the dropdown

  ngOnInit() {
    // Set initial value and direction if not already defined
    if (!this.value && this.options.length) {
      this.value = this.options[0].value;
      this.selectedOptionLabel = this.options[0].label;
    }
    if (!this.direction) {
      this.direction = SortDirection.ASC;
    }

    // Set the initial selected label
    this.updateSelectedOptionLabel();
  }

  // Opens the custom popover for sort options
  openPopover(event: any) {
    this.isPopoverOpen = true;
  }

  // Closes the custom popover
  closePopover() {
    this.isPopoverOpen = false;
  }

  /**
   * Handles the change of sorting option value
   * @param newValue the new sorting value chosen
   */
  changeSort(newValue: string) {
    this.value = newValue;
    this.direction = SortDirection.ASC;  // Reset to ASC when sort option changes
    this.updateSelectedOptionLabel();  // Update the displayed label in the button
    this.sortChange.emit({ value: this.value, direction: this.direction });
    this.closePopover();  // Close popover after selection
  }

  /**
   * Handles the change of sorting direction (ASC or DESC)
   * @param newDirection the new sorting direction
   */
  changeSortDirection(newDirection: SortDirection) {
    this.direction = newDirection;
    this.sortChange.emit({ value: this.value, direction: this.direction });
  }

  /**
   * Updates the selectedOptionLabel based on the current value
   */
  private updateSelectedOptionLabel() {
    const selectedOption = this.options.find(option => option.value === this.value);
    if (selectedOption) {
      this.selectedOptionLabel = selectedOption.label;
    }
  }
}

/**
 * Event emitted when a sorting change occurs
 */
export interface SortChange {
  value: string;
  direction: SortDirection;
}
