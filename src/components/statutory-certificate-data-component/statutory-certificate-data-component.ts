import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'statutory-certificate-data-component',
  templateUrl: 'statutory-certificate-data-component.html'
})
export class StatutoryCertificateDataComponent implements OnInit{

  @Input() statutoryCertificateData;

  constructor() {
  }

  ngOnInit(){
    console.log('stop');
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
