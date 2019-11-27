import { DwhHistoryModel } from './../../../../core/models/dwh-history/dwh-history.model';
import { DwhHistoryService } from './../../../../core/services/dwh-history/dwh-history.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { StatutoryCertificateModel } from '../../../../core/models/statutory.certificate.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    StatutoryCertificateService
} from '../../../../core/services/statutory-certificate/statutory-certificate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-statutory-certificate',
  templateUrl: 'statutory-certificate.page.html',
  styleUrls: ['./statutory-certificate.page.scss']
})

export class StatutoryCertificatePage {

  pnc: PncModel;
  formatedSpeciality: string;
  matricule: string;
  statutoryCertificate: StatutoryCertificateModel;
  dwhHistory: DwhHistoryModel;
  StatutoryCertificateDisplayTypeEnum = StatutoryCertificateDisplayTypeEnum;
  TabHeaderEnum = TabHeaderEnum;

  statutoryCertificateTab: StatutoryCertificateTabEnum;

  StatutoryCertificateTabEnum = StatutoryCertificateTabEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pncService: PncService,
    private statutoryCertificateProvider: StatutoryCertificateService,
    private dwhHistoryService: DwhHistoryService,
    private translateService: TranslateService
  ) {
    this.statutoryCertificateTab = StatutoryCertificateTabEnum.STATUTORY_CERTIFICATE;

   }

  /**
   * Séléctionne un sous-onglet
   * @param statutoryCertificateTab sous-onglet à sélectionner
   */
  displaySubTab(statutoryCertificateTab: StatutoryCertificateTabEnum) {
    this.statutoryCertificateTab = statutoryCertificateTab;
  }

  /**
   * Vérifie si un onglet est actif
   * @param statutoryCertificateTab le mode (onglet) à tester
   * @return vrai si le mode est actif, faux sinon
   */
  isTabActive(statutoryCertificateTab: StatutoryCertificateTabEnum): boolean {
    return statutoryCertificateTab === this.statutoryCertificateTab;
  }

  ionViewDidEnter() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(this.matricule).then(pnc => {
      this.pnc = pnc;
      this.formatedSpeciality = this.pncService.getFormatedSpeciality(pnc);
    }, error => { });
    this.statutoryCertificateProvider.getStatutoryCertificate(this.matricule).then(statutoryCertificate => {
      this.statutoryCertificate = statutoryCertificate;
    }, error => { });
    this.dwhHistoryService.getDwhHistory(this.matricule).then(dwhHistory => {
      this.dwhHistory = dwhHistory;
    });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.statutoryCertificate !== 'undefined' && typeof this.dwhHistory !== 'undefined';
  }
}
export enum StatutoryCertificateTabEnum {
    STATUTORY_CERTIFICATE, HISTORY
}
