import { Component, Input, OnInit, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'edospnc-datetime',
  templateUrl: './edospnc-datetime.component.html',
  styleUrls: ['./edospnc-datetime.component.scss']
})
export class EdospncDatetimeComponent implements OnInit, OnDestroy {
  @Input() disabled = false;
  @Input() datePlaceholder: string = '';
  @Input() edospncFormGroup: FormGroup;
  @Input() edospncFormControlName: string;
  @Input() minStartDate: string = '2020-01-01';

  @ViewChild('datetime', { static: false }) datePicker: IonDatetime;

  isDatePickerOpen = false;
  displayValue: string = '';

  private formControlSubscription: Subscription;

  ngOnInit() {
    this.updateDisplayValue();

    const control = this.edospncFormGroup.get(this.edospncFormControlName);
    if (control) {
      this.formControlSubscription = control.valueChanges.subscribe(value => {
        this.updateDisplayValue(value);
      });
    }
  }

  ngOnDestroy() {
    if (this.formControlSubscription) {
      this.formControlSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.edospncFormGroup || changes.edospncFormControlName) {
      this.updateDisplayValue();
    }
  }

  updateDisplayValue(value?: string) {
    const controlValue = value || this.edospncFormGroup.get(this.edospncFormControlName)?.value;
    if (controlValue) {
      this.displayValue = this.formatDate(controlValue);
    } else {
      this.displayValue = '';
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    const day = dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
    const month = (dateObj.getMonth() + 1) < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
    return `${day}/${month}/${dateObj.getFullYear()}`;
  }

  openDatePickerModal() {
    this.isDatePickerOpen = false;
    setTimeout(() => {
      this.isDatePickerOpen = true;
    }, 100);
  }

  closeDatePickerModal() {
    this.isDatePickerOpen = false;
    setTimeout(() => {
      this.isDatePickerOpen = false;
    }, 300);
  }

  clearDate() {
    const control = this.edospncFormGroup.get(this.edospncFormControlName);
    if (control && control.value) {
      console.log('Clearing date:', control.value);
    }

    control?.setValue(null);
    this.displayValue = '';
    this.closeDatePickerModal();
  }

  cancelDate() {
    this.closeDatePickerModal();
  }

  confirmDate() {
    const selectedDate = this.datePicker.value;

    if (Array.isArray(selectedDate)) {
      console.error('Selected date is an array. Expecting a single string.');
      return;
    }

    if (selectedDate) {
      this.displayValue = this.formatDate(selectedDate);
      this.edospncFormGroup.get(this.edospncFormControlName)?.setValue(selectedDate);
    }

    this.closeDatePickerModal();
  }
}