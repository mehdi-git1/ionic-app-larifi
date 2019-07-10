import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, Loading, PopoverController } from 'ionic-angular';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FixRecipientComponent } from '../fix-recipient/fix-recipient.component';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
  selector: 'congratulation-letter-action-menu',
  templateUrl: 'congratulation-letter-action-menu.component.html'
})
export class CongratulationLetterActionMenuComponent {

  congratulationLetter: CongratulationLetterModel;
  pnc: PncModel;

  loading: Loading;

  constructor(private navParams: NavParams,
    public congratulationLetterService: CongratulationLetterService,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController) {
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
      .delete(this.congratulationLetter.techId)
      .then(deletedcongratulationLetter => {
        this.toastService.success(this.translateService.instant('CONGRATULATION_LETTERS.TOAST.DELETE_SUCCESS'));
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
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
