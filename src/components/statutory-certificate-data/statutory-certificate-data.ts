import { TranslateService } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'statutory-certificate-data',
  templateUrl: 'statutory-certificate-data.html'
})
export class StatutoryCertificateDataComponent{

  @Input() statutoryCertificateData;

  constructor() {
  }

  /**
   * Gére les classes de data
   * @param dataType type de la data à gérer 'date, etc...)
   * @param dataValue valeur de la data
   */
  getCssClass(dataType, dataValue){
    if (dataType.indexOf('date') != -1 && !dataValue){
      return 'no-value';
    }
    if (dataType.indexOf('end-date') != -1 && dataValue > new Date()){
      return 'important-date';
    }
    return '';
  }
}
