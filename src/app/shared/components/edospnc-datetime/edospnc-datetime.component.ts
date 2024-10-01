import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edospnc-datetime',
  templateUrl: './edospnc-datetime.component.html',
  styleUrls: ['./edospnc-datetime.component.scss'],
})
export class EdospncDatetimeComponent implements OnInit, OnDestroy {
  @Input() disabled = false;
  @Input() datePlaceholder: string = '';
  @Input() edospncFormGroup: FormGroup;
  @Input() edospncFormControlName: string;
  @Input() minStartDate: string = '2020-01-01';

  isDatePickerOpen = false;  // Controls the visibility of the popover
  popoverEvent: any;

  displayValue: string = '';  // Stores the displayed value
  selectedDate: Date | null = null;  // Store the selected date
  private formControlSubscription: Subscription;

  ngOnInit() {
    this.updateDisplayValue();

    const control = this.edospncFormGroup.get(this.edospncFormControlName);
    if (control) {
      this.formControlSubscription = control.valueChanges.subscribe((value) => {
        this.updateDisplayValue(value);
      });
    }
  }

  ngOnDestroy() {
    if (this.formControlSubscription) {
      this.formControlSubscription.unsubscribe();
    }
  }
 
  // Updates the displayed value when a date is selected
  updateDisplayValue(value?: string) { 
    const controlValue = value || this.edospncFormGroup.get(this.edospncFormControlName)?.value;
    if (controlValue) {
      this.displayValue = this.formatDate(controlValue);
    } else {
      this.displayValue = '';
    }
  }

  // Formats the date for display
  formatDate(date: string | null): string {
    if (!date) return '';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    const day = dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate();
    const month = (dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1;
    return `${day}/${month}/${dateObj.getFullYear()}`;
  }

  // Opens the date picker
  openDatePicker(event: any) {
    this.popoverEvent = event;
    this.isDatePickerOpen = true;
  }

  // Closes the date picker manually
  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  // Clears the selected date and closes the date picker
  clearDate() {
    const control = this.edospncFormGroup.get(this.edospncFormControlName);
    if (control && control.value) {
      console.log('Clearing date:', control.value);
    }
    control?.setValue(null);
    this.displayValue = '';  // Clear the display value as well
    this.selectedDate = null;  // Reset the selected date
    this.closeDatePicker();  // Close the date picker after clearing
  }

  // Cancel date selection (doesn't apply the date)
  cancelDate() {
    this.closeDatePicker();  // Just close the date picker without saving the selected date
  }

  // Confirm the selected date and update the form control
  confirmDate() {
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate.toISOString());
      this.displayValue = formattedDate;
      this.edospncFormGroup.get(this.edospncFormControlName)?.setValue(this.selectedDate.toISOString().split('T')[0]);
    }
    this.closeDatePicker();  // Close the picker after confirming the date
  }

  // Method triggered when the user selects a date from the datepicker
  onDateSelect(date: Date) {
    // Ensure that we only consider the date part, and prevent timezone issues by setting time to noon
    this.selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); // Set time to noon to avoid timezone shift
  }
}
