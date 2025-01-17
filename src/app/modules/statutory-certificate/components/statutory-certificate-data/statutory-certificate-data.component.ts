import * as moment from 'moment';

import { Component, Input } from '@angular/core';

import {
    StatutoryCertificateDisplayTypeEnum
} from '../../../../core/enums/statutory-certificate-display-type.enum';

@Component({
  selector: 'statutory-certificate-data',
  templateUrl: 'statutory-certificate-data.component.html',
  styleUrls: ['./statutory-certificate-data.component.scss']
})
export class StatutoryCertificateDataComponent {

  @Input() statutoryCertificateData;
  @Input() title;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

  StatutoryCertificateDisplayTypeEnum = StatutoryCertificateDisplayTypeEnum;

  constructor() {
  }

  /**
   * Gére les classes de data
   * @param dataType type de la data à gérer 'date, etc...)
   * @param dataValue valeur de la data
   */
  getCssClass(dataType, dataValue) {
    if ((dataType.indexOf('date') !== -1 || dataType.indexOf('libelle') !== -1) && !dataValue) {
      return 'no-value';
    }
    if (dataType.indexOf('end-date') !== -1 && dataValue && moment().isAfter(dataValue)) {
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

  /**
   * Teste s'il y a des données à afficher
   * @return vrai si c'est le cas, faux sinon
   */
  hasNoData(): boolean {
    return !this.statutoryCertificateData
      || !this.statutoryCertificateData.values
      || this.statutoryCertificateData.values.length === 0
      || this.statutoryCertificateData.values[0].value.length === 0;
  }
}
