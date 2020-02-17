import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FileTypeEnum } from '../../../../core/enums/file-type.enum';
import { HelpAssetTypeEnum } from '../../../../core/enums/help-asset-type.enum';
import { PncRoleEnum } from '../../../../core/enums/pnc-role.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { FileService } from '../../../../core/file/file.service';
import { HelpAssetModel } from '../../../../core/models/help-asset.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../../core/services/device/device.service';
import { HelpAssetService } from '../../../../core/services/help-asset/help-asset.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';

@Component({
    selector: 'page-help-asset-list',
    templateUrl: 'help-asset-list.page.html',
    styleUrls: ['./help-asset-list.page.scss']
})
export class HelpAssetListPage {

    pncRole: PncRoleEnum;
    matricule: string;
    pnc: PncModel;

    localHelpAssets: HelpAssetModel[];
    remoteHelpAssets: HelpAssetModel[];

    fileTypeEnum;

    pdfUrl: string;

    TabHeaderEnum = TabHeaderEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private deviceService: DeviceService,
        private helpAssetService: HelpAssetService,
        private connectivityService: ConnectivityService,
        private fileService: FileService,
        private pncService: PncService
    ) {
        this.fileTypeEnum = FileTypeEnum;
        if (this.deviceService.isBrowser()) {
            this.pdfUrl = '../assets/pdf/helpAsset';
        } else {
            this.pdfUrl = './assets/pdf/helpAsset';
        }
    }

    ionViewDidEnter() {
        this.matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(this.matricule).then(pnc => {
            this.pnc = pnc;
            this.pncRole = pnc.manager ? PncRoleEnum.MANAGER : PncRoleEnum.PNC;

            this.localHelpAssets = new Array();
            // On récupère le role du pnc dans les paramètres de navigation
            this.localHelpAssets.push(...this.getCommunHelpAssets());
            if (this.pncRole === PncRoleEnum.MANAGER) {
                this.localHelpAssets.push(...this.getCADHelpAssets());
            } else if (this.pncRole === PncRoleEnum.PNC) {
                this.localHelpAssets.push(...this.getHSTHelpAssets());
            }
            this.localHelpAssets.sort((a, b) => a.label < b.label ? -1 : 1);
            // On récupère le role du pnc dans les paramètres de navigation
            if (this.connectivityService.isConnected() && this.pncRole) {
                this.helpAssetService.getHelpAssetList(this.pncRole).then(result => {
                    this.remoteHelpAssets = result;
                }, error => { });
            }
        }, error => {
        });

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
        const updateDate20180730 = '2018-07-30T13:11:52Z';
        const updateDate20190808 = '2019-08-08T11:33:52Z';

        const helpAsset = new Array(3);
        const pdf1 = 'Etapes-du-Bilan-Professionnel-V4.pdf';
        helpAsset[0] = new HelpAssetModel();
        helpAsset[0].url = `${this.pdfUrl}/cadre/${pdf1}`;
        helpAsset[0].label = 'Etapes du Bilan Professionnel V4';
        helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[0].lastUpdateDate = updateDate20180730;
        const pdf2 = 'Livret-instructeur-V6-22juin.pdf';
        helpAsset[1] = new HelpAssetModel();
        helpAsset[1].url = `${this.pdfUrl}/cadre/${pdf2}`;
        helpAsset[1].label = 'Livret instructeur V6';
        helpAsset[1].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[1].lastUpdateDate = updateDate20180730;
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
        helpAsset[3].lastUpdateDate = updateDate20180730;
        const pdf5 = 'Aide-a-la-redaction-vols-de-formation.pdf';
        helpAsset[4] = new HelpAssetModel();
        helpAsset[4].url = `${this.pdfUrl}/cadre/${pdf5}`;
        helpAsset[4].label = 'Aide à la rédaction vols de formation';
        helpAsset[4].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[4].lastUpdateDate = '2019-02-05T00:00:00Z';
        const pdf6 = 'Prepa-Express-Bilan-Pro.pdf';
        helpAsset[5] = new HelpAssetModel();
        helpAsset[5].url = `${this.pdfUrl}/cadre/${pdf6}`;
        helpAsset[5].label = 'Prepa Express Bilan Pro';
        helpAsset[5].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[5].lastUpdateDate = '2019-02-05T00:00:00Z';
        const pdf7 = 'Les_Bilans_Pro_dans_eDossierPNC.pdf';
        helpAsset[6] = new HelpAssetModel();
        helpAsset[6].url = `${this.pdfUrl}/cadre/${pdf7}`;
        helpAsset[6].label = 'Les Bilans Pro dans eDossierPNC';
        helpAsset[6].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[6].lastUpdateDate = '2019-05-24T00:00:00Z';
        const pdf8 = 'JDB-dans-eDossierPNC-V2.pdf';
        helpAsset[7] = new HelpAssetModel();
        helpAsset[7].url = `${this.pdfUrl}/cadre/${pdf8}`;
        helpAsset[7].label = 'JDB dans eDossierPNC V2';
        helpAsset[7].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[7].lastUpdateDate = '2019-10-22T00:00:00Z';
        const pdf9 = 'Prepa-express-vol-de-formation-CC.pdf';
        helpAsset[8] = new HelpAssetModel();
        helpAsset[8].url = `${this.pdfUrl}/cadre/${pdf9}`;
        helpAsset[8].label = 'Prepa Express Vol de Formation CC';
        helpAsset[8].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[8].lastUpdateDate = updateDate20190808;
        const pdf10 = 'Prepa-express-vol-de-formation-CCP.pdf';
        helpAsset[9] = new HelpAssetModel();
        helpAsset[9].url = `${this.pdfUrl}/cadre/${pdf10}`;
        helpAsset[9].label = 'Prepa Express Vol de Formation CCP';
        helpAsset[9].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[9].lastUpdateDate = updateDate20190808;
        const pdf11 = 'Prepa-express-vol-de-validation-CC.pdf';
        helpAsset[10] = new HelpAssetModel();
        helpAsset[10].url = `${this.pdfUrl}/cadre/${pdf11}`;
        helpAsset[10].label = 'Prepa Express Vol de Validation CC';
        helpAsset[10].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[10].lastUpdateDate = updateDate20190808;
        const pdf12 = 'Prepa-express-vol-de-validation-CCP.pdf';
        helpAsset[11] = new HelpAssetModel();
        helpAsset[11].url = `${this.pdfUrl}/cadre/${pdf12}`;
        helpAsset[11].label = 'Prepa Express Vol de Validation CCP';
        helpAsset[11].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[11].lastUpdateDate = updateDate20190808;
        const pdf13 = 'Indicateurs_Metier_eDossier_guidelines.pdf';
        helpAsset[12] = new HelpAssetModel();
        helpAsset[12].url = `${this.pdfUrl}/cadre/${pdf8}`;
        helpAsset[12].label = 'Les Indicateurs Métier dans eDossierPNC';
        helpAsset[12].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[12].lastUpdateDate = '2020-02-25T00:00:00Z';

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
        const helpAsset = new Array(2);
        const pdfName = 'Priorites-compilees-CCP-CC-HST-V7-1er-octobre.pdf';
        helpAsset[0] = new HelpAssetModel();
        helpAsset[0].url = `${this.pdfUrl}/commun/${pdfName}`;
        helpAsset[0].label = 'Priorités compilées CCP-CC-HST V7';
        helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[0].lastUpdateDate = '2018-10-01T13:11:52Z';
        helpAsset[1] = new HelpAssetModel();
        helpAsset[1].url = `${this.pdfUrl}/commun/Visuel_Relais_RH_ Interactif_V12.pdf`;
        helpAsset[1].label = 'Fiches Missions Relais';
        helpAsset[1].helpAssetType = HelpAssetTypeEnum.PDF;
        helpAsset[1].lastUpdateDate = '2020-02-25T00:00:00Z';
        return helpAsset;
    }
}
