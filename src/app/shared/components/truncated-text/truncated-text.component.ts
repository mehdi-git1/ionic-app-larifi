import { Component, Input, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'truncated-text',
  templateUrl: 'truncated-text.component.html',
  styleUrls: ['./truncated-text.component.scss']
})

export class TruncatedTextComponent {

  @Input() inputText: string;

  @ViewChild('textTarget', { static: true }) textTarget: any;

  constructor(
    private alertCtrl: AlertController,
    private translateService: TranslateService) {
  }

  /**
   * Affiche le text complet dans une popup, quand on appuie sur le lien 'Afficher plus'
   */
  showMore() {
    this.alertCtrl.create({
      header: '',
      message: this.inputText,
      buttons: [
        {
          text: this.translateService.instant('GLOBAL.BUTTONS.OK'),
          role: 'cancel'
        }
      ],
      cssClass: 'truncated-text-alert',
      backdropDismiss: true
    }).then(alert => alert.present());
  }

  /**
   * Verifie l'affichage du line 'Afficher plus' quand le text dépasse les 3 lignes
   */
  displayShowMoreLink() {
    const textTargetHeight = this.textTarget.nativeElement.offsetHeight;
    const childHeight = this.textTarget.nativeElement.firstChild.offsetHeight;
    return childHeight > textTargetHeight;
  }
}
