import { HelpAssetProvider } from './../../providers/help-asset/help-asset';
import { HelpAsset } from './../../models/helpAsset';
import { PncRole } from './../../models/pncRole';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-help-asset-list',
    templateUrl: 'help-asset-list.html',
})
export class HelpAssetListPage {

    pncRole: PncRole;
    helpAssets: HelpAsset[];

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private helpAssetProvider: HelpAssetProvider) {
    }

    ionViewDidEnter() {
        // On récupère le role du pnc dans les paramètres de navigation
        if (this.navParams.get('pncRole')) {
            this.pncRole = this.navParams.get('pncRole');
            this.helpAssetProvider.getHelpAssetList(this.pncRole).then(result => {
                this.helpAssets = result;
            }, error => { });
        }
    }

    /**
     * Ouvre un nouvel onglet vers URL donné
     * @param link URL qui sera ouvert sur le nouvel onglet
     */
    openHelpAsset(link: string) {
        window.open(link);
    }
}
