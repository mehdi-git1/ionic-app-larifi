import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, Loading } from 'ionic-angular';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'congratulation-letter-action-menu',
  templateUrl: 'congratulation-letter-action-menu.component.html'
})
export class CongratulationLetterActionMenuComponent {

  congratulationLetter: CongratulationLetterModel;

  loading: Loading;

  constructor(private navParams: NavParams,
    public congratulationLetterService: CongratulationLetterService,
    public translateService: TranslateService,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    public viewCtrl: ViewController) {
    this.congratulationLetter = this.navParams.get('congratulationLetter');
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
   * Ferme la popover
   */
  closePopover() {
    this.viewCtrl.dismiss();
  }
}
