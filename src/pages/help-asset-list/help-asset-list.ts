import { HelpAssetProvider } from './../../providers/help-asset/help-asset';
import { HelpAsset } from './../../models/helpAsset';
import { TranslateService } from '@ngx-translate/core';
import { ToastProvider } from './../../providers/toast/toast';
import { PncRole } from './../../models/pncRole';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-help-asset-list',
  templateUrl: 'help-asset-list.html',
})
export class HelpAssetListPage {

  pncRole: PncRole;
  helpAssets: HelpAsset[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private helpAssetProvider: HelpAssetProvider,
    private toastProvider: ToastProvider,
    public translateService: TranslateService) {
  }

  /** Ouvre un nouvel onglet vers URL donné
   * @param link URL qui sera ouvert sur le nouvel onglet
   */
  openTab(link: string) {
    window.open(link);
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {

      // On récupère le role du pnc dans les paramètres de navigation
      if (this.navParams.get('pncRole')) {
        this.pncRole = this.navParams.get('pncRole');
      } else {
        resolve();
      }

      this.helpAssetProvider.getHelpAssetList(this.pncRole).then(result => {
        this.helpAssets = result;
      }, error => {
        reject();
      });
    });
  }
}
