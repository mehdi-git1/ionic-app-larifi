import { HelpAssetType } from './../../models/helpAssetType';
import { Type } from '@angular/compiler/src/core';
import { ConnectivityService } from './../../services/connectivity.service';
import { DeviceService } from './../../services/device.service';
import { TranslateService } from '@ngx-translate/core';
import { PdfFileViewerPage } from './../pdf-file-viewer/pdf-file-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HelpAssetProvider } from './../../providers/help-asset/help-asset';
import { HelpAsset } from './../../models/helpAsset';
import { PncRole } from './../../models/pncRole';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-help-asset-list',
    templateUrl: 'help-asset-list.html',
})
export class HelpAssetListPage {

    localHelpAssets: HelpAsset[];
    remoteHelpAssets: HelpAsset[];

    pdfUrl: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private deviceService: DeviceService,
        private translateService: TranslateService,
        private helpAssetProvider: HelpAssetProvider,
        private connectivityService: ConnectivityService) {
        if (this.deviceService.isBrowser()) {
            this.pdfUrl = '../assets/pdf/helpAsset';
        } else {
            this.pdfUrl = './assets/pdf/helpAsset';
        }
    }

    ionViewDidEnter() {
        this.localHelpAssets = new Array();
        // On récupère le role du pnc dans les paramètres de navigation
        this.localHelpAssets.push(...this.getCommunHelpAssets());
        if (this.navParams.get('pncRole') && this.navParams.get('pncRole') === PncRole.MANAGER) {
            this.localHelpAssets.push(...this.getCADHelpAssets());
        } else if (this.navParams.get('pncRole') && this.navParams.get('pncRole') === PncRole.PNC) {
            this.localHelpAssets.push(...this.getHSTHelpAssets());
        }
        this.localHelpAssets.sort((a, b) => a.label < b.label ? -1 : 1);
        // On récupère le role du pnc dans les paramètres de navigation
        if (this.connectivityService.isConnected() && this.navParams.get('pncRole')) {
            this.helpAssetProvider.getHelpAssetList(this.navParams.get('pncRole')).then(result => {
                this.remoteHelpAssets = result;
            }, error => { });
        }
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.localHelpAssets !== undefined && this.remoteHelpAssets !== undefined;
    }

    /**
     * renvoie vers la page d'affichage des pdf avec l'url du pdf demandé et le title à afficher dans le cas d'un pdf
     * Ouvre une fenetre de navigation avec l'url conçernée dans la cas d'une URL.
     * @param helpAsseturl la ressource d'aide concernée
     */
    displayHelpAsset(helpAsset: HelpAsset) {
        if (helpAsset.helpAssetType === HelpAssetType.PDF) {
            this.navCtrl.push(PdfFileViewerPage, { pdfSrc: helpAsset.url, title: helpAsset.label });
        } else if (helpAsset.helpAssetType === HelpAssetType.URL) {
            window.open(helpAsset.url);
        }
    }

    /**
     * renvoie la liste des ressources d'aide du cadre
     */
    getCADHelpAssets(): HelpAsset[] {
        const helpAsset = new Array(3);
        const pdf1 = 'Etapes-du-Bilan-Professionnel-V4.pdf';
        helpAsset[0] = new HelpAsset();
        helpAsset[0].url = `${this.pdfUrl}/cadre/${pdf1}`;
        helpAsset[0].label = 'Etapes du Bilan Professionnel V4';
        helpAsset[0].helpAssetType = HelpAssetType.PDF;
        helpAsset[0].lastUpdateDate = '2018-07-30T13:11:52Z';
        const pdf2 = 'Livret-instructeur-V6-22juin.pdf';
        helpAsset[1] = new HelpAsset();
        helpAsset[1].url = `${this.pdfUrl}/cadre/${pdf2}`;
        helpAsset[1].label = 'Livret instructeur V6';
        helpAsset[1].helpAssetType = HelpAssetType.PDF;
        helpAsset[1].lastUpdateDate = '2018-07-30T13:11:52Z';
        const pdf3 = 'Manuel-Utilisateur-Manager-Coach-v1.pdf';
        helpAsset[2] = new HelpAsset();
        helpAsset[2].url = `${this.pdfUrl}/cadre/${pdf3}`;
        helpAsset[2].label = 'Manuel Utilisateur V1';
        helpAsset[2].helpAssetType = HelpAssetType.PDF;
        helpAsset[2].lastUpdateDate = '2018-09-06T10:00:00Z';
        const pdf4 = 'Mode-opératoire-Journal-de-bord.pdf';
        helpAsset[3] = new HelpAsset();
        helpAsset[3].url = `${this.pdfUrl}/cadre/${pdf4}`;
        helpAsset[3].label = 'Mode opératoire, Journal de bord';
        helpAsset[3].helpAssetType = HelpAssetType.PDF;
        helpAsset[3].lastUpdateDate = '2018-07-30T13:11:52Z';
        return helpAsset;
    }

    /**
     * Renvoie la liste des ressources d'aide du pnc
     */
    getHSTHelpAssets(): HelpAsset[] {
        return [];
    }

    /**
     * Renvoie la liste des ressources d'aide du pnc
     */
    getCommunHelpAssets(): HelpAsset[] {
        const helpAsset = new Array(1);
        const pdfName = 'Objectifs-compiles-CCP-CC-HST-V6.pdf';
        helpAsset[0] = new HelpAsset();
        helpAsset[0].url = `${this.pdfUrl}/commun/${pdfName}`;
        helpAsset[0].label = 'Objectifs compiles CCP, CC, HST V6';
        helpAsset[0].helpAssetType = HelpAssetType.PDF;
        helpAsset[0].lastUpdateDate = '2018-07-30T13:11:52Z';
        return helpAsset;
    }
}
