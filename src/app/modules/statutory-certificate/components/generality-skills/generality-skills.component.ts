import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { GeneralitySkillsModel } from '../../../../core/models/statutory-certificate/generality-skills.model';
import { StatutoryCertificateDisplayTypeEnum } from '../../../../core/enums/statutory-certificate-display-type.enum';

@Component({
  selector: 'generality-skills',
  templateUrl: 'generality-skills.component.html'
})
export class GeneralitySkillsComponent implements OnInit {

  @Input() generalitySkillsData: GeneralitySkillsModel;
  @Input() title: string;
  @Input() displayType: StatutoryCertificateDisplayTypeEnum;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDisplayedData;

  // Tableau des libelles de compétences
  skillTitles: Array<string>;

  constructor(public translateService: TranslateService
  ) {
    this.skillTitles = [
      this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.TITLE'),
      this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.TITLE'),
      this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.TITLE')
    ];
  }

  ngOnInit() {
    this.skillDisplayedData = {
      headers:
        [
          '',
          this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.START_DATE'),
          this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.DUE_DATE'),
          '',
          '',
          ''
        ],
      values: this.generalitySkillsData ?
        [
          { value: this.skillTitles, type: 'text' },
          {
            value: [_.get(this.generalitySkillsData, 'cca.startDate'),
            _.get(this.generalitySkillsData, 'pcb.validityStartDate'),
              ''
            ], type: 'date'
          },
          {
            value: ['',
              _.get(this.generalitySkillsData, 'pcb.validityEndDate'),
              _.get(this.generalitySkillsData, 'gene.dueDate')
            ], type: 'date'
          },
          { value: [''], type: 'text' },
          { value: [''], type: 'text' },
          { value: [''], type: 'text' }
        ]
        :
        null
    };
  }

}
