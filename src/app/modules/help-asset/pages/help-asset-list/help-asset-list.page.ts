import { FileService } from './../../../../core/file/file.service';
import { HelpAssetTypeEnum } from '../../../../core/enums/help-asset-type.enum';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { HelpAssetService } from '../../../../core/services/help-asset/help-asset.service';
import { HelpAssetModel } from '../../../../core/models/help-asset.model';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FileTypeEnum } from '../../../../core/enums/file-type.enum';

@Component({
    selector: 'page-help-asset-list',
    templateUrl: 'help-asset-list.page.html',
})
export class HelpAssetListPage {

    localHelpAssets: HelpAssetModel[];
    remoteHelpAssets: HelpAssetModel[];

    fileTypeEnum;

    pdfUrl: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private deviceService: DeviceService,
        private helpAssetProvider: HelpAssetService,
        private connectivityService: ConnectivityService,
        private fileService: FileService
    ) {
        this.fileTypeEnum = FileTypeEnum;
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
        if (this.navParams.get('pncRole') && this.navParams.get('pncRole') === PncRoleEnum.MANAGER) {
            this.localHelpAssets.push(...this.getCADHelpAssets());
        } else if (this.navParams.get('pncRole') && this.navParams.get('pncRole') === PncRoleEnum.PNC) {
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
    displayHelpAsset(helpAsset: HelpAssetModel, type: string) {
        this.fileService.displayFile(type, helpAsset.url);
    }

    /**
     * renvoie la liste des ressources d'aide du cadre
     */
    getCADHelpAssets(): HelpAssetModel[] {
        const helpAsset = new Array(3);
        const pdf1 = 'Etapes-du-Bilan-Professionnel-V4.pdf';
        helpAsset[0] = new HelpAssetModel();
        helpAsset[0].url = `${this.pdfUrl}/cadre/${pdf1}`;
        helpAsset[0].label = 'Etapes du Bilan Professionnel V4';
        helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[0].lastUpdateDate = '2018-07-30T13:11:52Z';
        const pdf2 = 'Livret-instructeur-V6-22juin.pdf';
        helpAsset[1] = new HelpAssetModel();
        helpAsset[1].url = `${this.pdfUrl}/cadre/${pdf2}`;
        helpAsset[1].label = 'Livret instructeur V6';
        helpAsset[1].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[1].lastUpdateDate = '2018-07-30T13:11:52Z';
        const pdf3 = 'Manuel-Utilisateur-Manager-Coach-v1.pdf';
        helpAsset[2] = new HelpAssetModel();
        helpAsset[2].url = `${this.pdfUrl}/cadre/${pdf3}`;
        helpAsset[2].label = 'Manuel Utilisateur V1';
        helpAsset[2].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[2].lastUpdateDate = '2018-09-14T10:00:00Z';
        const pdf4 = 'Mode-operatoire-Journal-de-bord.pdf';
        helpAsset[3] = new HelpAssetModel();
        helpAsset[3].url = `${this.pdfUrl}/cadre/${pdf4}`;
        helpAsset[3].label = 'Mode opératoire, Journal de bord';
        helpAsset[3].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[3].lastUpdateDate = '2018-07-30T13:11:52Z';
        return helpAsset;
    }

    /**
     * Renvoie la liste des ressources d'aide du pnc
     */
    getHSTHelpAssets(): HelpAssetModel[] {
        const helpAsset = new Array(1);
        const UserManual = 'Manuel-Utilisateur-PNC-V1.0.pdf';
        helpAsset[0] = new HelpAssetModel();
        helpAsset[0].url = `${this.pdfUrl}/hst/${UserManual}`;
        helpAsset[0].label = 'Manuel Utilisateur V1';
        helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[0].lastUpdateDate = '2018-09-12T10:00:00Z';
        return helpAsset;
    }

    /**
     * Renvoie la liste des ressources d'aide du pnc
     */
    getCommunHelpAssets(): HelpAssetModel[] {
        const helpAsset = new Array(1);
        const pdfName = 'Priorites-compilees-CCP-CC-HST-V7-1er-octobre.pdf';
        helpAsset[0] = new HelpAssetModel();
        helpAsset[0].url = `${this.pdfUrl}/commun/${pdfName}`;
        helpAsset[0].label = 'Priorités compilées CCP-CC-HST V7';
        helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[0].lastUpdateDate = '2018-10-01T13:11:52Z';
        return helpAsset;
    }
}
