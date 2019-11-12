import { Observable } from 'rxjs';

import { HostListener, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { CanDeactivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AlertDialogService } from '../../core/services/alertDialog/alert-dialog.service';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

    changesNotSavedDialogForm: FormGroup;

    constructor(private alertDialog: AlertDialogService, private formBuilder: FormBuilder, private translateService: TranslateService) {
        this.changesNotSavedDialogForm = this.formBuilder.group({
            dialogTitle: [this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE')],
            dialogMsg: [this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE')],
            dialogType: ['confirm'],
            okBtnTitle: [this.translateService.instant('GLOBAL.BUTTONS.CONFIRM')],
            cancelBtnTitle: [this.translateService.instant('GLOBAL.BUTTONS.CANCEL')]
        });
    }

    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> | Promise<boolean> {
        if (!component.canDeactivate()) {
            return this.confirmCancelChanges();
        }
        return Promise.resolve(true);
    }

    async confirmCancelChanges() {
        const dialogRef = this.alertDialog.openAlertDialog(this.changesNotSavedDialogForm.value);
        const result =  await dialogRef.afterClosed().toPromise();
        if (result === 'ok' || result === 'true') {
            return true;
        } else {
            return false;
        }
    }
}

export abstract class ComponentCanDeactivate {
    abstract  canDeactivate(): boolean;

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = true;
        }
    }
}

export abstract class FormCanDeactivate extends ComponentCanDeactivate {

    abstract get form(): NgForm;

    canDeactivate(): boolean {
      // return !this.form.dirty;
      return false;
    }
}
