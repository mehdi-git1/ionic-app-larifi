import { PncRole } from './../../models/pncRole';
import { ToastProvider } from './../../providers/toast/toast';
import { CareerObjectiveCreatePage } from './../career-objective-create/career-objective-create';
import { CareerObjective } from './../../models/careerObjective';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CareerObjectiveProvider } from '../../providers/career-objective/career-objective';


@Component({
  selector: 'page-career-objective-list',
  templateUrl: 'career-objective-list.html',
})
export class CareerObjectiveListPage {

  careerObjectiveList: CareerObjective[];

  matricule: string;
  loading: boolean;

  // Expose l'enum au template
  PncRole = PncRole;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private careerObjectiveProvider: CareerObjectiveProvider,
    private toastProvider: ToastProvider) {

  }

  ionViewDidLoad() {
    this.matricule = this.navParams.get('matricule');
  }

  ionViewDidEnter() {
    this.loading = true;
    this.careerObjectiveProvider.getCareerObjectiveList(this.matricule).then(result => {
      this.careerObjectiveList = result;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  /**
   * Dirige vers la page de création d'un nouvel objectif
   */
  goToCareerObjectiveCreation() {
    this.navCtrl.push(CareerObjectiveCreatePage, { matricule: this.matricule });
  }

  /**
   * Ouvre un objectif => redirige vers la page de création de l'objectif
   * @param careerObjectiveId l'id de l'objectif à ouvrir
   */
  openCareerObjective(careerObjectiveId: number) {
    this.navCtrl.push(CareerObjectiveCreatePage, { careerObjectiveId: careerObjectiveId });
  }
}
