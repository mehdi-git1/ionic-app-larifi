import { AppConstant } from 'src/app/app.constant';
import { Utils } from 'src/app/shared/utils/utils';

import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PncModel } from '../../../core/models/pnc.model';
import { RelayModel } from '../../../core/models/statutory-certificate/relay.model';
import { PncService } from '../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../core/services/synchronization/synchronization.service';
import { ToastService } from '../../../core/services/toast/toast.service';
import { OfflineIndicatorComponent } from '../offline-indicator/offline-indicator.component';

@Component({
  selector: 'pnc-header',
  templateUrl: 'pnc-header.component.html',
  styleUrls: ['./pnc-header.component.scss']
})
export class PncHeaderComponent implements OnChanges {

  @Input() pnc: PncModel;
  formatedSpeciality: string;
  synchroInProgress: boolean;

  showSendMailButton = true;

  @ViewChild(OfflineIndicatorComponent, { static: false })
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(
    private synchronizationService: SynchronizationService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private pncService: PncService,
    private sessionService: SessionService) {
  }

  ngOnChanges() {
    if (this.pnc) {
      if (this.sessionService.getActiveUser().matricule == this.pnc.matricule) {
        this.showSendMailButton = false;
      }
      if (this.pnc.relays) {
        this.pnc.relays.sort((relay: RelayModel, otherRelay: RelayModel) => {
          return relay.code > otherRelay.code ? 1 : -1;
        });
      }
    }
  }

  /**
   * Récupère les relais formatés pour l'affichage
   */
  getFormatedSpeciality(): string {
    return this.pncService.getFormatedSpeciality(this.pnc);
  }

  /**
   * Formatte l'affichage des informations d'affectation.
   * @param pnc le pnc concerné par l'affectation
   * @returns les informations d'affectation formatées.
   */
  getFormattedAffectationInfo(pnc: PncModel): string {
    let formatedAffectation = '';
    formatedAffectation = (pnc?.assignment?.ginq) ? pnc.assignment.ginq : '';
    formatedAffectation = (pnc?.groupPlanning) ?
      ((formatedAffectation.length > 0) ?
        formatedAffectation.concat(AppConstant.SPACE, AppConstant.DASH, AppConstant.SPACE, pnc.groupPlanning) : pnc.groupPlanning)
      : formatedAffectation

    return formatedAffectation.length === 0 ? AppConstant.DASH : formatedAffectation;
  }
  /**
   * Précharge le eDossier du PNC
   */
  downloadPncEdossier(pnc: PncModel) {
    this.synchroInProgress = true;
    const matricule = pnc.matricule;
    this.synchronizationService.storeEDossierOffline(pnc).then(success => {
      this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
      this.synchroInProgress = false;
      this.toastService.info(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE', { matricule }));
    }, error => {
      this.toastService.error(this.translateService.instant('SYNCHRONIZATION.PNC_SAVED_OFFLINE_ERROR', { matricule }));
      this.synchroInProgress = false;
    });
  }

  /**
   * Renvoie la string à afficher en fonction de la valeur du TAF
   */
  getTafValue(): string {
    return this.pnc.taf ? 'Oui' : 'Non';
  }

  /**
   * Construit l'adresse mail de l'instructeur
   * @return l'adresse mail de l'instructeur
   */
  getInstructorMail(): string {
    return Utils.getPncMail(this.pnc.pncInstructor.lastName, this.pnc.pncInstructor.firstName, this.pnc.pncInstructor.matricule);
  }

  /**
   * Ouvre l'application d'envoie de mail, avec le mail du pnc
   */
  sendMailToPnc() {
    location.href = 'mailto:' + Utils.getPncMail(this.pnc.lastName, this.pnc.firstName, this.pnc.matricule);
  }
}
