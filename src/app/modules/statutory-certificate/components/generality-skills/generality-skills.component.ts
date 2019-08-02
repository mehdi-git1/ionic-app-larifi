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
  skillTitleArray: Array<string>;

  // Tableau des listes de START_DATE
  startDateArray: Array<string>;

  // Tableau des listes de START_DATE
  dueDateArray: Array<string>;

  constructor(public translateService: TranslateService
  ) { }

  ngOnInit() {
    this.skillTitleArray = [this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.TITLE')];
    this.startDateArray = [_.get(this.generalitySkillsData, 'cca.startDate')];
    this.dueDateArray = [''];

    if (this.generalitySkillsData && this.generalitySkillsData.seniorityDate) {
      this.skillTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.SENIORITY_DATE.TITLE'));
      this.startDateArray.push(_.get(this.generalitySkillsData, 'seniorityDate'));
      this.dueDateArray.push(StatutoryCertificateDisplayTypeEnum.NTBD);
    }

    this.skillTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.TITLE'));
    this.startDateArray.push(_.get(this.generalitySkillsData, 'pcb.validityStartDate'));
    this.startDateArray.push(StatutoryCertificateDisplayTypeEnum.NTBD);
    this.dueDateArray.push(_.get(this.generalitySkillsData, 'pcb.validityEndDate'));

    const pcbValidityEndDate = new Date(_.get(this.generalitySkillsData, 'pcb.validityEndDate'));
    const newDate = new Date();
    if (pcbValidityEndDate == undefined || pcbValidityEndDate < newDate) {
      this.skillTitleArray.push(this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.TITLE'));
      this.dueDateArray.push(_.get(this.generalitySkillsData, 'gene.dueDate'));
    }

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
          { value: this.skillTitleArray, type: 'text' },
          { value: this.startDateArray, type: 'date' },
          { value: this.dueDateArray, type: 'date' },
          { value: [''], type: 'text' },
          { value: [''], type: 'text' },
          { value: [''], type: 'text' }
        ]
        :
        null
    };
  }

}
