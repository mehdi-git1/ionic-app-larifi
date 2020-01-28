import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input } from '@angular/core';
import { StatutoryCertificateDisplayTypeEnum } from 'src/app/core/enums/statutory-certificate-display-type.enum';

@Component({
  selector: 'pnc-manifex',
  templateUrl: './manifex.component.html',
  styleUrls: ['./manifex.component.scss'],
})
export class ManifexComponent implements OnInit {

  @Input() manifexCreationDate: Date;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

  manifexDisplayedData;
  tempManifexData;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.tempManifexData = { creationDate: new Array() };
    if (this.manifexCreationDate) {
      this.tempManifexData.creationDate.push(this.manifexCreationDate);
    }
    this.manifexDisplayedData = {
      headers: [this.translateService.instant('STATUTORY_CERTIFICATE.MANIFEX.CREATION_DATE')],
      values: this.manifexCreationDate ? [{ value: this.tempManifexData.creationDate, type: 'date' }] : null
    };
  }
}

