import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AlertController, Events, LoadingController, NavParams, PopoverController
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import {
    CongratulationLetterModeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { FixRecipientComponent } from '../fix-recipient/fix-recipient.component';

@Component({
  selector: 'congratulation-letter-action-menu',
  templateUrl: 'congratulation-letter-action-menu.component.html',
  styleUrls: ['./congratulation-letter-action-menu.component.scss']
})
export class CongratulationLetterActionMenuComponent {

  congratulationLetter: CongratulationLetterModel;

  mode: CongratulationLetterModeEnum;

  pnc: PncModel;

  concernedPncMatricule: string;

  constructor(
    private navParams: NavParams,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public congratulationLetterService: CongratulationLetterService,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    public popoverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private events: Events) {
    this.congratulationLetter = this.navParams.get('congratulationLetter');
    this.mode = this.navParams.get('congratulationLetterMode');
    this.pnc = this.navParams.get('pnc');
  }

  /**
   * Met à jour une lettre de félicitation
   */
  updateCongratulationLetter() {
    this.popoverCtrl.dismiss('congratulationLetter:update');
  }

  /**
   * Efface une lettre de félicitation
   */
  deleteCongratulationLetter() {
    this.loadingCtrl.create().then(loading => {
      loading.present();

      this.congratulationLetterService
        .delete(this.congratulationLetter.techId, this.pnc.matricule, this.mode)
        .then(deletedcongratulationLetter => {
          this.toastService.success(this.translateService.instant('CONGRATULATION_LETTERS.TOAST.DELETE_SUCCESS'));
          this.events.publish('CongratulationLetter:deleted');
          loading.dismiss();
        }, error => {
          loading.dismiss();
        });
    });

    this.popoverCtrl.dismiss();
  }

  /**
   * Corrige le destinataire
   * @param event événement de la page
   */
  fixRecipient(event: Event) {
    event.stopPropagation();
    this.popoverCtrl.create({
      component: FixRecipientComponent,
      componentProps: { congratulationLetter: this.congratulationLetter, pnc: this.pnc },
      cssClass: 'fix-recipient-popover'
    }).then(popover => popover.present());
    this.popoverCtrl.dismiss();
  }

  /**
   * Présente une alerte pour confirmer la suppression de la priorité
   */
  confirmDeleteCongratulationLetter() {
    this.alertCtrl.create({
      header: this.translateService.instant('CONGRATULATION_LETTERS.CONFIRM_DELETE.TITLE'),
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
    }).then(alert => alert.present());
  }

  /**
   * Ferme la popover
   */
  closePopover() {
    this.popoverCtrl.dismiss();
  }

  /**
   * Verifie qu'il s'agit bien du mode des lettres rédigées
   * @return true s'il s'agit du mode des lettres rédigées, false sinon
   */
  isWrittenMode() {
    return this.mode === CongratulationLetterModeEnum.WRITTEN;
  }

}
