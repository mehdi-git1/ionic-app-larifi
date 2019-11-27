import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import {
    AlertDialogConfig
} from '../../../shared/components/alert-dialog/alert-dialog-config.interface';
import {
    AlertDialogComponent
} from '../../../shared/components/alert-dialog/alert-dialog.component';

@Injectable()
/**
 * A service used for opening a custom dialog with options specified
 */
export class AlertDialogService {
    constructor(private dialog: MatDialog) { }
    /**
     * Retrieves the default custom dialog config
     * @param dialogType The dialog's type
     * @returns The default custom dialog config
     */
    private _getDefaultAlertDialogConfig(dialogType?: 'alert' | 'confirm'): AlertDialogConfig {
        return {
            dialogTitle: dialogType === 'alert' ? 'Alert' : 'Confirm',
            dialogType: dialogType ? dialogType : 'alert'
        };
    }

    /**
     * Opens an alert dialog
     * @param config Configuration options for the custom dialog
     * @param dialogConfig Configuration options for the internal dialog config
     * @returns The dialog reference of the currently-opened dialog
     */
    openAlertDialog(
        config?: AlertDialogConfig,
        dialogConfig?: MatDialogConfig<AlertDialogConfig>): MatDialogRef<AlertDialogComponent, string> {
        let currentConfig: AlertDialogConfig;
        let currentDialogConfig: MatDialogConfig<AlertDialogConfig>;
        if (config) {
            currentConfig = config;
        } else {
            currentConfig = this._getDefaultAlertDialogConfig('alert');
        }

        if (dialogConfig) {
            currentDialogConfig = dialogConfig;
            if (currentConfig && !currentDialogConfig.data) {
                currentDialogConfig.data = currentConfig;
            } else {
                currentDialogConfig.data = this._getDefaultAlertDialogConfig('confirm');
            }
        } else {
            currentDialogConfig = {
                data: currentConfig
            };
        }

        currentDialogConfig.autoFocus = false;
        return this.dialog.open<AlertDialogComponent, AlertDialogConfig>(AlertDialogComponent, currentDialogConfig);
    }
}
