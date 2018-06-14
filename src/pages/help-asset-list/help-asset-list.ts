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

  typeProfil: string;
  role: PncRole;
  resources: HelpAsset[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private helpAssetProvider: HelpAssetProvider,
    private toastProvider: ToastProvider,
    public translateService: TranslateService) {
  }

  /**
   * @param link this is the url that the new tab will open
   */
  openTab(link: string) {
    window.open(link);
  }

  ionViewCanEnter() {
    this.role = this.navParams.get('pncRole');
    if (this.role !== undefined) {
      if (this.role !== PncRole.MANAGER) {
        this.typeProfil = 'PNC';
      } else {
        this.typeProfil = 'MANAGER';
      }
      this.helpAssetProvider.getHelpAssetList(this.typeProfil).then(result => {
        this.resources = result;
      }, error => { });
    } else {
      this.toastProvider.error(this.translateService.instant('HELP_RESOURCES_LIST.UNKNOWN_ERROR'));
    }
  }


}
