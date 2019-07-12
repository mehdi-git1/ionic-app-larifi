import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { Component } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FixRecipientComponent } from '../fix-recipient/fix-recipient.component';
import { PncModel } from '../../../../core/models/pnc.model';
import { NavParams, ViewController, LoadingController, Loading, AlertController, PopoverController } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Component({
  selector: 'congratulation-letter-action-menu',
  templateUrl: 'congratulation-letter-action-menu.component.html'
})
export class CongratulationLetterActionMenuComponent {

  congratulationLetter: CongratulationLetterModel;
  pnc: PncModel;

  concernedPncMatricule: string;

  loading: Loading;

  constructor(private navParams: NavParams,
    public congratulationLetterService: CongratulationLetterService,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private events: Events) {
    this.congratulationLetter = this.navParams.get('congratulationLetter');
    this.pnc = this.navParams.get('pnc');
  }

  /**
   * Efface une lettre de félicitation
   */
  deleteCongratulationLetter() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.congratulationLetterService
      .delete(this.congratulationLetter.techId, this.concernedPncMatricule)
      .then(deletedcongratulationLetter => {
        this.toastService.success(this.translateService.instant('CONGRATULATION_LETTERS.TOAST.DELETE_SUCCESS'));
        this.events.publish('CongratulationLetterList:refresh');
        this.loading.dismiss();
      },
        error => {
          this.loading.dismiss();
        });

    this.viewCtrl.dismiss();
  }

  /**
   * Corriger le destinataire
   */
  fixRecipient(event: Event) {
    event.stopPropagation();
    const popover = this.popoverCtrl.create(FixRecipientComponent, { congratulationLetter: this.congratulationLetter, pnc: this.pnc }, { cssClass: 'fix-recipient-popover' });
    popover.present({});
    this.viewCtrl.dismiss();
  }

  /**
   * Présente une alerte pour confirmer la suppression de la priorité
   */
  confirmDeleteCongratulationLetter() {
    this.alertCtrl.create({
      title: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.TITLE'),
      message: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.MESSAGE'),
      buttons: [
        {
          text: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.CANCEL'),
          role: 'cancel',
          handler: () => this.closePopover()
        },
        {
          text: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.CONFIRM'),
          handler: () => this.deleteCongratulationLetter()
        }
      ]
    }).present();
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
