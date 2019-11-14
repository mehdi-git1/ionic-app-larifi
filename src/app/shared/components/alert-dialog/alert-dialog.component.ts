import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { AlertDialogConfig } from './alert-dialog-config.interface';

@Component({
  selector: 'edospnc-admin-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public config: AlertDialogConfig, public dialogRef: MatDialogRef<AlertDialogComponent>) { }

  /**
   * Returns the value of a variable or its default equivalant
   * @returns The value of the variable/its default equivalant if it is untruthy
   */
  getValOrDefaultVal(val: any, defaultVal: any): any {
    return val ? val : defaultVal;
  }

  /**
   * Checks if the dialog message is HTML
   */
  get isDialogMsgHtml(): boolean {
    return typeof this.config.dialogMsg === 'object';
  }

  confirm() {
    this.dialogRef.close('true');
  }

  cancel() {
    this.dialogRef.close('false');
  }
}
