import { NavController, NavParams } from 'ionic-angular';

import { Component, Input, OnInit } from '@angular/core';

import { CareerObjectiveModel } from '../../../../core/models/career-objective.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { PncService } from '../../../../core/services/pnc/pnc.service';
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

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private pncService: PncService) {
  }

  ngOnInit() {
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
