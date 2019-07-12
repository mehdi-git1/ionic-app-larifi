import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Events } from 'ionic-angular';

@Component({
  selector: 'congratulation-letter-action-menu',
  templateUrl: 'congratulation-letter-action-menu.component.html'
})
export class CongratulationLetterActionMenuComponent {

  congratulationLetter: CongratulationLetterModel;

  concernedPncMatricule: string;

  loading: Loading;

  constructor(private navParams: NavParams,
    public congratulationLetterService: CongratulationLetterService,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    private alertCtrl: AlertController,
    private events: Events,
    public viewCtrl: ViewController) {
    this.congratulationLetter = this.navParams.get('congratulationLetter');
    this.concernedPncMatricule = this.navParams.get('concernedPncMatricule');
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
        this.events.publish('CongratulationLetter:deleted');
        this.loading.dismiss();
      },
        error => {
          this.loading.dismiss();
        });

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
