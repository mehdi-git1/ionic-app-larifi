import { Speciality } from './../../models/speciality';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HelpResourceProvider } from '../../providers/help-resource/help-resource';
import { HelpResource } from './../../models/helpResource';
/**
 * Generated class for the HelpResourceListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-help-resource-list',
  templateUrl: 'help-resource-list.html',
})
export class HelpResourceListPage {

  typeProfil: string;
  speciality: Speciality;
  resources: HelpResource[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private helpResourceProvider: HelpResourceProvider) {
  }

  ionViewDidLoad() {
    this.speciality = this.navParams.get('Speciality');
    if (this.speciality !== Speciality.CAD) {
      this.typeProfil = 'PNC';
    } else {
      this.typeProfil = 'CADRE';
    }

    this.helpResourceProvider.getHelpResourceList(this.typeProfil).then(result => {
      this.resources = result;
    }, error => { });
  }

}
