import { GeneralitySkills } from './../../models/statutoryCertificate/generalitySkills';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'generality-skills',
  templateUrl: 'generality-skills.html'
})
export class GeneralitySkillsComponent implements OnInit{

  @Input() generalitySkillsData: GeneralitySkills ;

  // Tableau des valeurs à afficher en fonction du type de tableau
  skillDataDisplayed: {};

  constructor(public translateService: TranslateService
   ) {
    this.skillDataDisplayed = {cca: [], pcb: [], gene: []};
   }

  ngOnInit(){
    this.skillDataDisplayed = {
      cca:
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.TITLE'),
            value: _.get(this.generalitySkillsData, 'cca.libelle'),
            type: 'libelle'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.CCA.START_DATE'),
            value: _.get(this.generalitySkillsData, 'cca.startDate'),
            type: 'date'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }
        ],
      pcb:
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.TITLE'),
            value: _.get(this.generalitySkillsData, 'pcb.libelle'),
            type: 'libelle'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.START_DATE'),
            value: _.get(this.generalitySkillsData, 'pcb.startDate'),
            type: 'date'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.PCB.DUE_DATE'),
            value: _.get(this.generalitySkillsData, 'pcb.dueDate'),
            type: 'date'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }, {
            libelle: '',
            value: '',
            type: 'text'
          }
        ],
      gene:
        [{
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.AIRCRAFT_SKILL'),
            value: _.get(this.generalitySkillsData, 'gene.aircraftSkill'),
            type: 'libelle'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.START_DATE'),
            value: _.get(this.generalitySkillsData, 'gene.startDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.MDC_DATE'),
            value: _.get(this.generalitySkillsData, 'gene.mdcDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.DUE_DATE'),
            value: _.get(this.generalitySkillsData, 'gene.dueDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.DDV_DUE_DATE'),
            value: _.get(this.generalitySkillsData, 'gene.ddvDueDate'),
            type: 'date'
          }, {
            libelle: this.translateService.instant('STATUTORY_CERTIFICATE.GENERALITY_SKILLS.GENE.SKILL_END_DATE'),
            value: _.get(this.generalitySkillsData, 'gene.endDate'),
            type: 'end-date'
          }
        ]
    };
  }

}
