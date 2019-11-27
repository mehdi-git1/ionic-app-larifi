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

  StatutoryCertificateDisplayTypeEnum = StatutoryCertificateDisplayTypeEnum;
  TabHeaderEnum = TabHeaderEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pncService: PncService,
    private statutoryCertificateProvider: StatutoryCertificateService
  ) { }

  ionViewDidEnter() {
    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
    this.pncService.getPnc(this.matricule).then(pnc => {
      this.pnc = pnc;
      this.formatedSpeciality = this.pncService.getFormatedSpeciality(pnc);
    }, error => { });
    this.statutoryCertificateProvider.getStatutoryCertificate(this.matricule).then(statutoryCertificate => {
      this.statutoryCertificate = statutoryCertificate;
    }, error => { });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return typeof this.statutoryCertificate !== 'undefined';
  }
}
