import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';

@Component({
  selector: 'edospnc-datetime',
  templateUrl: './edospnc-datetime.component.html',
  styleUrls: ['./edospnc-datetime.component.scss']
})
export class EdospncDatetimeComponent implements OnInit {
  @Input() disabled = false;  // To disable the date picker if needed
  @Input() datePlaceholder: string = '';  // Placeholder for the date input
  @Input() edospncFormGroup: FormGroup;  // Parent form group
  @Input() edospncFormControlName: string;  // Form control name to bind to
  @Input() minStartDate: string = '2020-01-01';  // Minimum start date allowed

  @ViewChild('datetime', { static: false }) datePicker: IonDatetime;  // Reference to ion-datetime

  isDatePickerOpen = false;  // Tracks whether the date picker modal is open
  displayValue: string = '';  // Holds the formatted date for display

  ngOnInit() {
    // Initialize the display value from the form control on component init
    this.updateDisplayValue();

    // Listen for form control value changes and update the display value
    const control = this.edospncFormGroup.get(this.edospncFormControlName);
    if (control) {
      control.valueChanges.subscribe(value => {
        this.updateDisplayValue(value);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle changes in form group or form control name input
    if (changes.edospncFormGroup || changes.edospncFormControlName) {
      this.updateDisplayValue();
    }
  }

  // Updates the display value of the date picker when the form value changes
  updateDisplayValue(value?: string) {
    const controlValue = value || this.edospncFormGroup.get(this.edospncFormControlName)?.value;
    if (controlValue) {
      this.displayValue = this.formatDate(controlValue);  // Format the date for display
    } else {
      this.displayValue = '';  // Clear the display if the value is empty
    }
  }

  // Formats the date to DD/MM/YYYY format for display
  formatDate(date: string | null): string {
    if (!date) return '';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';  // Handle invalid date

    const day = dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
    const month = (dateObj.getMonth() + 1) < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
    return `${day}/${month}/${dateObj.getFullYear()}`;
  }

  // Opens the date picker modal
  openDatePickerModal() {
    this.isDatePickerOpen = true;
  }

  // Closes the date picker modal
  closeDatePickerModal() {
    this.isDatePickerOpen = false;
  }

  // Clears the selected date and resets the form control
  clearDate() {
    const control = this.edospncFormGroup.get(this.edospncFormControlName);
  
    if (control && control.value) {
      console.log('Clearing date:', control.value);
    }

    // Reset the form control value and clear the display
    control?.setValue(null);
    this.displayValue = '';
    this.closeDatePickerModal();
  }

  // Cancels the date selection and closes the modal without updating the form control
  cancelDate() {
    this.closeDatePickerModal();
  }

  // Confirms the selected date, updates the form control, and closes the modal
  confirmDate() {
    const selectedDate = this.datePicker.value;  // Get selected date from the date picker

    if (Array.isArray(selectedDate)) {
      console.error('Selected date is an array. Expecting a single string.');
      return;
    }

    if (selectedDate) {
      // Update the display and form control with the formatted date
      this.displayValue = this.formatDate(selectedDate);
      this.edospncFormGroup.get(this.edospncFormControlName)?.setValue(selectedDate);
    }

    this.closeDatePickerModal();
  }
}
