import { NavController, NavParams } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { SettingsPage } from '../../pages/settings/settings';

@Component({
  selector: 'navbar-custom',
  templateUrl: 'navbar-custom.html'
})
export class NavBarCustomComponent {

  @Input()
  title: string;

  constructor(private navCtrl: NavController,
    private navParams: NavParams) {

  }

  /**
   * Dirige vers la page de paramètrage
   */
  goToWaypointCreate() {
    this.navCtrl.push(SettingsPage);
  }

}
