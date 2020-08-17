import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable()
export class AlertDialogService {
    constructor(private alertCtrl: AlertController) { }

    openAlertDialog(
        title: string,
        message: string,
        confirmLabel: string,
        cancelLabel: string
    ): Promise<HTMLIonAlertElement> {
        const alertPromise = this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: cancelLabel,
                    role: 'cancel'
                },
                {
                    text: confirmLabel,
                    role: 'confirm'
                }
            ]
        });
        alertPromise.then(alert => alert.present());
        return alertPromise;
    }
}
