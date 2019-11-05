import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import {
    EObservationDisplayModeEnum
} from '../../../../core/enums/eobservation/eobservation-display-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { EObservationModel } from '../../../../core/models/eobservation/eobservation.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ModuleModel } from '../../../../core/models/professional-level/module.model';
import {
    ProfessionalLevelModel
} from '../../../../core/models/professional-level/professional-level.model';
import { StageModel } from '../../../../core/models/professional-level/stage.model';
import { EObservationService } from '../../../../core/services/eobservation/eobservation.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import {
    ProfessionalLevelService
} from '../../../../core/services/professional-level/professional-level.service';
import { StageLegendComponent } from '../../components/stage-legend/stage-legend.component';

@Component({
  selector: 'page-professional-level',
  templateUrl: 'professional-level.page.html',
  styleUrls: ['./professional-level.page.scss']
})
export class ProfessionalLevelPage implements OnInit {

  pnc: PncModel;
  matricule: string;
  professionalLevel: ProfessionalLevelModel;

  eObservations: EObservationModel[];
  eObservationsFiltered: EObservationModel[];
  listItemLegend = [];

  EObservationDisplayModeEnum = EObservationDisplayModeEnum;
  TabHeaderEnum = TabHeaderEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pncService: PncService,
    private professionalLevelService: ProfessionalLevelService,
    private eObservationService: EObservationService,
    private popoverCtrl: PopoverController) {
  }

  ngOnInit() {

    this.listItemLegend.push('PROFESSIONAL_LEVEL.LEGEND.A',
      'PROFESSIONAL_LEVEL.LEGEND.T',
      'PROFESSIONAL_LEVEL.LEGEND.R',
      'PROFESSIONAL_LEVEL.LEGEND.E1',
      'PROFESSIONAL_LEVEL.LEGEND.E2',
      'PROFESSIONAL_LEVEL.LEGEND.FC');

    this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);

    this.pncService.getPnc(this.matricule).then(pnc => {
      this.pnc = pnc;
      this.getEObservationsList();
    }, error => { });

    this.professionalLevelService.getProfessionalLevel(this.matricule).then(professionalLevelResult => {
      this.professionalLevel = this.sortProfessionalLevel(professionalLevelResult);
    }, error => { });

  }

  /**
   * Renvoi un clone trié du ProfessionalLevelModel passé en parametre
   *
   * @param professionalLevel l'objet à cloner
   * @return clone trié du ProfessionalLevelModel passé en parametre.
   */
  sortProfessionalLevel(professionalLevel: ProfessionalLevelModel): ProfessionalLevelModel {
    const sortedProfessionalLevel: ProfessionalLevelModel = _.cloneDeep(professionalLevel);

    if (sortedProfessionalLevel && sortedProfessionalLevel.stages) {
      // Tri de l'ordre des stages
      sortedProfessionalLevel.stages = this.sortStagesByDate(sortedProfessionalLevel.stages);

      // Tri de l'ordre des modules
      for (const stage of sortedProfessionalLevel.stages) {
        if (stage.modules) {
          stage.modules = this.sortModulesByDate(stage.modules);
        }
      }
    }
    return sortedProfessionalLevel;
  }

  /**
   * Trie la liste des stages par ordre
   * @param stages liste de stages
   * @return liste de stages triés
   */
  sortStagesByDate(stages: StageModel[]): StageModel[] {
    return stages.sort((a, b) => a.date < b.date ? 1 : -1);
  }

  /**
   * Trie la liste des modules par ordre
   * @param modules liste de modules
   * @return liste de modules triés
   */
  sortModulesByDate(modules: ModuleModel[]): ModuleModel[] {
    return modules.sort((a, b) => a.date < b.date ? 1 : -1);
  }

  /**
   * Récupére la liste des eObservations
   *
   * @return la liste des eObs
   */
  getEObservationsList(): void {
    this.eObservationService.getEObservations(this.matricule).then(eObservations => {
      this.eObservations = eObservations;
    }, error => {
    });
  }

  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return this.professionalLevel !== undefined && this.eObservations !== undefined;
  }

  /**
   * Affiche la légende des stage
   * @param event l'événement déclencheur
   */
  showStageLegend(event: any) {
    event.stopPropagation();
    this.popoverCtrl.create({
      component: StageLegendComponent,
      event: event,
      translucent: true
    }).then(popover => {
      popover.present();
    });
  }
}
