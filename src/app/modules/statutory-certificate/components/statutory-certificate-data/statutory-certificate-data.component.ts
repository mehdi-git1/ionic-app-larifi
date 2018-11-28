import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'statutory-certificate-data',
  templateUrl: 'statutory-certificate-data.component.html'
})
export class StatutoryCertificateDataComponent {

  @Input() statutoryCertificateData;

  constructor() {
  }
  /**
   * Gére les classes de data
   * @param dataType type de la data à gérer 'date, etc...)
   * @param dataValue valeur de la data
   */
  getCssClass(dataType, dataValue) {
    if ((dataType.indexOf('date') != -1 || dataType.indexOf('libelle') != -1) && !dataValue) {
      return 'no-value';
    }
    if (dataType.indexOf('end-date') != -1 && dataValue && moment().isAfter(dataValue)) {
      return 'important-date';
    }
    return '';
  }

  /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
  loadingIsOver(): boolean {
    return this.statutoryCertificateData !== undefined;
  }
}