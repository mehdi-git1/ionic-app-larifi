import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';

import {GeneralitySkillsModel} from '../../../../core/models/statutory-certificate/generality-skills.model';

@Component({
  selector: 'generality-skills',
  templateUrl: 'generality-skills.component.html'
})
export class GeneralitySkillsComponent implements OnInit {

  @Input() generalitySkillsData: GeneralitySkillsModel;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDisplayedData;

  constructor(public translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.skillDisplayedData = {
      cca: {
        headers:
          [
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.TITLE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.START_DATE'),
            '',
            '',
            '',
            ''
          ],
        values: this.generalitySkillsData && this.generalitySkillsData.cca ?
          [
            { value: [_.get(this.generalitySkillsData, 'cca.label')], type: 'libelle' },
            { value: [_.get(this.generalitySkillsData, 'cca.startDate')], type: 'date' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' }
          ]
          :
          null
      },
      pcb: {
        headers:
          [
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.TITLE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.START_DATE'),
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.DUE_DATE'),
            '',
            '',
            ''
          ],
        values: this.generalitySkillsData && this.generalitySkillsData.pcb ?
          [
            { value: [_.get(this.generalitySkillsData, 'pcb.label')], type: 'libelle' },
            { value: [_.get(this.generalitySkillsData, 'pcb.validityStartDate')], type: 'date' },
            { value: [_.get(this.generalitySkillsData, 'pcb.validityEndDate')], type: 'date' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' }
          ]
          :
          null
      },
      gene: {
        headers:
          [
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.TITLE'),
            '',
            this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.DUE_DATE'),
            '',
            '',
            ''
          ],
        values: this.generalitySkillsData && this.generalitySkillsData.gene ?
          [
            { value: [_.get(this.generalitySkillsData, 'gene.startDate')], type: 'date' },
            { value: [''], type: 'text' },
            { value: [_.get(this.generalitySkillsData, 'gene.dueDate')], type: 'end-date' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' },
            { value: [''], type: 'text' }
          ]
          :
          null
      }
    };
  }

}
