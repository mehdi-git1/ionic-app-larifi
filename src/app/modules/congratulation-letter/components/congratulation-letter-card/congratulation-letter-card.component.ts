import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import {
    CongratulationLetterModeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import {
    CongratulationLetterRedactorTypeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-redactor-type.enum';
import {
    CongratulationLetterFlightModel
} from '../../../../core/models/congratulation-letter-flight.model';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CongratulationLetterService
} from '../../../../core/services/congratulation-letter/congratulation-letter.service';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { Utils } from '../../../../shared/utils/utils';
import {
    CongratulationLetterActionMenuComponent
} from '../../components/congratulation-letter-action-menu/congratulation-letter-action-menu.component';

@Component({
  selector: 'congratulation-letter-card',
  templateUrl: 'congratulation-letter-card.component.html',
  styleUrls: ['./congratulation-letter-card.component.scss']
})
export class CongratulationLetterCardComponent {

  @Input() mode: CongratulationLetterModeEnum;

  @Input() congratulationLetter: CongratulationLetterModel;

  @Input() pnc: PncModel;

  CongratulationLetterModeEnum = CongratulationLetterModeEnum;
  CongratulationLetterRedactorTypeEnum = CongratulationLetterRedactorTypeEnum;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
    private popoverCtrl: PopoverController,
    private congratulationLetterService: CongratulationLetterService,
    private connectivityService: ConnectivityService) {
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
    this.router.navigate(['detail', congratulationLetter.techId], { relativeTo: this.activatedRoute });
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
   * Vérifie que l'on est en mode connecté
   * @return true si on est en mode connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }

  /**
   * Ouvre la popover de description d'un item
   * @param event l'événement déclencheur
   * @param congratulationLetter la lettre dont le menu d'actions a été ouvert
   */
  openActionsMenu(event: Event, congratulationLetter: CongratulationLetterModel) {
    event.stopPropagation();
    this.popoverCtrl.create({
      component: CongratulationLetterActionMenuComponent,
      event: event,
      componentProps: {
        congratulationLetter: congratulationLetter,
        pnc: this.pnc,
        congratulationLetterMode: this.mode,
        navCtrl: this.router
      },
      cssClass: 'action-menu-popover'
    }).then(popover => {
      popover.present();
    });
  }

  /**
   * Récupère une chaine de caractère vide si la valeur est null
   * @return une chaine vide, ou la valeur passée en paramètre si celle ci est non null
   */
  getEmptyStringIfNull(value: string) {
    return Utils.getEmptyStringIfNull(value);
  }
}
