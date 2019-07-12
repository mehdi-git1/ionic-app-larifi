import { CongratulationLetterRedactorTypeEnum } from './../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import { CongratulationLetterFlightModel } from './../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterService } from './../../../../core/services/congratulation-letter/congratulation-letter.service';
import { NavController, PopoverController } from 'ionic-angular';
import { CongratulationLetterDetailPage } from './../../pages/congratulation-letter-detail/congratulation-letter-detail.page';
import { CongratulationLetterModeEnum } from './../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { Component, Input } from '@angular/core';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { SecurityService } from './../../../../core/services/security/security.service';
import { CongratulationLetterActionMenuComponent } from './../../components/congratulation-letter-action-menu/congratulation-letter-action-menu.component';
import { PncModel } from '../../../../core/models/pnc.model';

@Component({
  selector: 'congratulation-letter-card',
  templateUrl: 'congratulation-letter-card.component.html'
})
export class CongratulationLetterCardComponent {

  @Input() mode: CongratulationLetterModeEnum;

  @Input() congratulationLetter: CongratulationLetterModel;

  @Input() pnc: PncModel;

  CongratulationLetterModeEnum = CongratulationLetterModeEnum;
  CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;

  constructor(private navCtrl: NavController,
    private securityService: SecurityService,
    public popoverCtrl: PopoverController,
    private congratulationLetterService: CongratulationLetterService
  ) {
  }

  /**
   * Vérifie le mode d'affichage actif
   * @param mode le mode à tester
   * @return vrai si le mode testé correspond au mode actif, faux sinon
   */
  isMode(mode: CongratulationLetterModeEnum): boolean {
    return this.mode === mode;
  }

  /**
  * Redirige vers la page de détail d'une lettre de félicitation
  * @param congratulationLetter la lettre qu'on souhaite afficher
  */
  goToCongratulationLetterDetail(congratulationLetter: CongratulationLetterModel): void {
    this.navCtrl.push(CongratulationLetterDetailPage, { matricule: this.pnc.matricule, congratulationLetterId: congratulationLetter.techId });
  }

  /**
   * Retourne la date du vol, formatée pour l'affichage
   * @param flight le vol dont on souhaite avoir la date formatée
   * @return la date formatée du vol
   */
  getFormatedFlightDate(flight: CongratulationLetterFlightModel): string {
    return this.congratulationLetterService.getFormatedFlightDate(flight);
  }

  /**
  * Vérifie si le PNC est manager
  * @return vrai si le PNC est manager, faux sinon
  */
  isManager(): boolean {
    return this.securityService.isManager();
  }

  /**
   * Ouvre la popover de description d'un item
   * @param myEvent  event
   * @param eObservationItem item
   */
  openActionsMenu(myEvent: Event, congratulationLetter: CongratulationLetterModel) {
    myEvent.stopPropagation();
    const popover = this.popoverCtrl.create(CongratulationLetterActionMenuComponent, { congratulationLetter: congratulationLetter, pnc: this.pnc }, { cssClass: 'action-menu-popover' });
    popover.present({ ev: myEvent });
  }
}
