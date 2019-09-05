import { NavController, NavParams } from 'ionic-angular';

import { Component, Input, OnInit } from '@angular/core';

import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    CareerObjectiveService
} from '../../../../core/services/career-objective/career-objective.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SecurityService } from '../../../../core/services/security/security.service';
import { SessionService } from '../../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../../core/services/synchronization/synchronization.service';
import {
    CareerObjectiveCreatePage
} from '../../pages/career-objective-create/career-objective-create.page';

@Component({
  selector: 'career-objective-list',
  templateUrl: 'career-objective-list.component.html',
})
export class CareerObjectiveListComponent implements OnInit {

  @Input() careerObjectives: CareerObjectiveModel[];
  matricule: string;

  pnc: PncModel;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private securityService: SecurityService,
    private careerObjectiveService: CareerObjectiveService,
    private sessionService: SessionService,
    private synchronizationService: SynchronizationService,
    private pncService: PncService) {
    console.log('test constructeur');
  }

  ngOnInit() {
    console.log('test onInit');
    this.matricule = this.navParams.get('matricule');
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule, careerObjectiveId: 0 });
  }

  /**
   * Renvoie la spécialité du pnc à afficher
   * @param pnc le pnc concerné
   * @return la fonction du pnc à afficher
   */
  getFormatedSpeciality(pnc: PncModel): string {
    return this.pncService.getFormatedSpeciality(pnc);
  }
}
