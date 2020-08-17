import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AlertDialogService } from '../alertDialog/alert-dialog.service';

@Injectable()
export class CancelChangesService {

    constructor(
        private alertDialogService: AlertDialogService,
        private translateService: TranslateService) {
    }

    /**
     * Ouvre une popup de confirmation d'abandon des modifications
     * @return la promise contenant la réponse à la popup
     */
    async openCancelChangesPopup(): Promise<boolean> {
        const alert = await this.alertDialogService.openAlertDialog(
            this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.TITLE'),
            this.translateService.instant('GLOBAL.CONFIRM_BACK_WITHOUT_SAVE.MESSAGE'),
            this.translateService.instant('GLOBAL.BUTTONS.CONFIRM'),
            this.translateService.instant('GLOBAL.BUTTONS.CANCEL')
        );
        return alert.onDidDismiss().then(value => {
            if (value.role === 'confirm') {
                return Promise.resolve(true);
            } else {
                return Promise.resolve(false);
            }
        });
    }
}
