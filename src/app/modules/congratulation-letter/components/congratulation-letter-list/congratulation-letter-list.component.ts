import { Component, Input } from '@angular/core';

import {
    CongratulationLetterModeEnum
} from '../../../../core/enums/congratulation-letter/congratulation-letter-mode.enum';
import { CongratulationLetterModel } from '../../../../core/models/congratulation-letter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { SecurityService } from '../../../../core/services/security/security.service';

@Component({
  selector: 'congratulation-letter-list',
  templateUrl: 'congratulation-letter-list.component.html',
  styleUrls: ['./congratulation-letter-list.component.scss']
})
export class CongratulationLetterListComponent {

  @Input() mode: CongratulationLetterModeEnum;

  @Input() congratulationLetters: CongratulationLetterModel[];

  @Input() pnc: PncModel;

  CongratulationLetterModeEnum = CongratulationLetterModeEnum;

  constructor(
    private securityService: SecurityService,
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
}
