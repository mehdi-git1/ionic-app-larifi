import { HelpAssetType } from './../../models/helpAssetType';
import { ConnectivityService } from './../../services/connectivity.service';
import { DeviceService } from './../../services/device.service';
import { HelpAssetProvider } from './../../providers/help-asset/help-asset';
import { HelpAsset } from './../../models/helpAsset';
import { PncRole } from './../../models/pncRole';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { File } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';

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
        private helpAssetProvider: HelpAssetProvider,
        private connectivityService: ConnectivityService,
        private inAppBrowser: InAppBrowser,
        private file: File,
        public httpClient: HttpClient
    ) {
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
        return this.localHelpAssets !== undefined;
    }

    /**
     * Ouvre une fenetre de navigation avec l'url conçernée (lien web ou URL PDF).
     * @param helpAsseturl la ressource d'aide concernée
     */
    displayHelpAsset(helpAsset: HelpAsset, type: string) {

        if (type === 'url' || this.deviceService.isBrowser()) {
            this.inAppBrowser.create(helpAsset.url, '_system', '');
            return true;
        }

        const rep = this.file.dataDirectory;
        // Si on récupére un fichier PDF sur l'iPad, il faut le recréer hors des assets
        // Pour ne pas avoir une URL en localhost, il faut créer un fichier directement sur l'IPAD
        // Il y'a des problémes CORS avec les fichiers en localhost://
        this.file.createDir(rep, 'edossier', true).then(
            createDirReturn => {
                this.file.createFile(rep + '/edossier', 'pdfToDisplay.pdf', true).then(
                    createFileReturn => {
                        this.httpClient.get(helpAsset.url, { responseType: 'blob' }).subscribe(result => {
                            this.file.writeExistingFile(rep + '/edossier', 'pdfToDisplay.pdf', result).then(
                                writingFileReturn => {
                                    this.inAppBrowser.create(rep + '/edossier/' + 'pdfToDisplay.pdf', '_blank', 'hideurlbar=no,location=no,toolbarposition=top'
                                    );
                                }
                            );
                        });
                    });
            });
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
        helpAsset[2].lastUpdateDate = '2018-09-14T10:00:00Z';
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
        const helpAsset = new Array(1);
        const UserManual = 'Manuel-Utilisateur-PNC-V1.0.pdf';
        helpAsset[0] = new HelpAsset();
        helpAsset[0].url = `${this.pdfUrl}/hst/${UserManual}`;
        helpAsset[0].label = 'Manuel Utilisateur V1';
        helpAsset[0].helpAssetType = HelpAssetType.PDF;
        helpAsset[0].lastUpdateDate = '2018-09-12T10:00:00Z';
        return helpAsset;
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
