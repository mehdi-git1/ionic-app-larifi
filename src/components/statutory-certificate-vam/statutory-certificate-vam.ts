import { VAM } from './../../models/statutoryCertificate/vam';
import { DateTransformService } from './../../services/date.transform.service';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'statutory-certificate-vam',
  templateUrl: 'statutory-certificate-vam.html'
})
export class StatutoryCertificateVamComponent {

  @Input() vam: VAM;

  constructor(private dateTransformer: DateTransformService) {
  }

  getCssClassForEndDate(): string{
    if (!this.vam || !this.vam.validityEndDate) {
      return 'no-value';
    }
    if (this.vam && this.vam.validityEndDate && moment().isBefore(this.vam.validityEndDate) {
      return 'important-date';
    }
    return '';
  }
}
