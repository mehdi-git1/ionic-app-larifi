import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AlertDialogService } from '../alertDialog/alert-dialog.service';

@Injectable()
export class CancelChangesService {

    private changesNotSavedDialogForm: FormGroup;

    constructor(
        private alertDialog: AlertDialogService,
        private formBuilder: FormBuilder,
        private translateService: TranslateService) {
        this.changesNotSavedDialogForm = this.formBuilder.group({
            dialogTitle: [this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE')],
            dialogMsg: [this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE')],
            dialogType: ['confirm'],
            okBtnTitle: [this.translateService.instant('GLOBAL.BUTTONS.CONFIRM')],
            cancelBtnTitle: [this.translateService.instant('GLOBAL.BUTTONS.CANCEL')]
        });
    }


    /**
     * Ouvre une popup de confirmation d'abandon des modifications
     * @return la promise contenant la réponse à la popup
     */
    async openCancelChangesPopup(): Promise<boolean> {
        const dialogRef = this.alertDialog.openAlertDialog(this.changesNotSavedDialogForm.value);
        const result = await dialogRef.afterClosed().toPromise();
        if (result === 'ok' || result === 'true') {
            return true;
        } else {
            return false;
        }
    }
}
