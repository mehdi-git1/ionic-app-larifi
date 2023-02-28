import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { FileTypeEnum } from "../../../../core/enums/file-type.enum";
import { HelpAssetTypeEnum } from "../../../../core/enums/help-asset-type.enum";
import { PncRoleEnum } from "../../../../core/enums/pnc-role.enum";
import { TabHeaderEnum } from "../../../../core/enums/tab-header.enum";
import { FileService } from "../../../../core/file/file.service";
import { HelpAssetModel } from "../../../../core/models/help-asset.model";
import { PncModel } from "../../../../core/models/pnc.model";
import { ConnectivityService } from "../../../../core/services/connectivity/connectivity.service";
import { DeviceService } from "../../../../core/services/device/device.service";
import { HelpAssetService } from "../../../../core/services/help-asset/help-asset.service";
import { PncService } from "../../../../core/services/pnc/pnc.service";

@Component({
  selector: "page-help-asset-list",
  templateUrl: "help-asset-list.page.html",
  styleUrls: ["./help-asset-list.page.scss"],
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
      this.pdfUrl = "../assets/pdf/helpAsset";
    } else {
      this.pdfUrl = "./assets/pdf/helpAsset";
    }
  }

  ionViewDidEnter() {
    this.matricule = this.pncService.getRequestedPncMatricule(
      this.activatedRoute
    );
    this.pncService.getPnc(this.matricule).then(
      (pnc) => {
        this.pnc = pnc;
        this.pncRole = pnc.manager ? PncRoleEnum.MANAGER : PncRoleEnum.PNC;

        this.localHelpAssets = new Array();
        // On récupère le role du pnc dans les paramètres de navigation
        this.localHelpAssets.push(...this.getCommunHelpAssets());
        if (this.pncRole === PncRoleEnum.MANAGER) {
          this.localHelpAssets.push(...this.getCADHelpAssets());
        }
        this.localHelpAssets.sort((a, b) => (a.label < b.label ? -1 : 1));
        // On récupère le role du pnc dans les paramètres de navigation
        if (this.connectivityService.isConnected() && this.pncRole) {
          this.helpAssetService.getHelpAssetList(this.pncRole).then(
            (result) => {
              this.remoteHelpAssets = result;
            },
            (error) => { }
          );
        }
      },
      (error) => { }
    );
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
  displayHelpAsset(helpAsset: HelpAssetModel, type: FileTypeEnum) {
    this.fileService.displayFile(type, helpAsset.url);
  }

  /**
   * renvoie la liste des ressources d'aide du cadre
   */
  getCADHelpAssets(): HelpAssetModel[] {
    const updateDate20180730 = "2018-07-30T13:11:52Z";
    const updateDate20230308 = "2023-03-08T00:00:52Z";

    const helpAsset = new Array(3);

    const pdf1 = "Lettres_de_félicitations_guidelines.pdf";
    helpAsset[0] = new HelpAssetModel();
    helpAsset[0].url = `${this.pdfUrl}/cadre/${pdf1}`;
    helpAsset[0].label = "Les lettres de félicitations dans eDossierPNC";
    helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[0].lastUpdateDate = "2020-11-09T00:00:00Z";
    const pdf2 = "Livret-instructeur-V6-22juin.pdf";
    helpAsset[1] = new HelpAssetModel();
    helpAsset[1].url = `${this.pdfUrl}/cadre/${pdf2}`;
    helpAsset[1].label = "Livret instructeur V6";
    helpAsset[1].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[1].lastUpdateDate = updateDate20180730;

    const pdf3 = "Mode-operatoire-Journal-de-bord.pdf";
    helpAsset[2] = new HelpAssetModel();
    helpAsset[2].url = `${this.pdfUrl}/cadre/${pdf3}`;
    helpAsset[2].label = "Mode opératoire, Journal de bord";
    helpAsset[2].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[2].lastUpdateDate = updateDate20180730;

    const pdf4 = "Aide-a-la-redaction-vols-de-formation.pdf";
    helpAsset[3] = new HelpAssetModel();
    helpAsset[3].url = `${this.pdfUrl}/cadre/${pdf4}`;
    helpAsset[3].label = "Aide à la rédaction vols de formation";
    helpAsset[3].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[3].lastUpdateDate = "2019-02-05T00:00:00Z";

    const pdf5 = "eObservations_guidelines.pdf";
    helpAsset[4] = new HelpAssetModel();
    helpAsset[4].url = `${this.pdfUrl}/cadre/${pdf5}`;
    helpAsset[4].label = "Les eObservations dans eDossierPNC";
    helpAsset[4].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[4].lastUpdateDate = "2020-11-09T00:00:00Z";

    const pdf6 = "Documents_RH_guidelines.pdf";
    helpAsset[5] = new HelpAssetModel();
    helpAsset[5].url = `${this.pdfUrl}/cadre/${pdf6}`;
    helpAsset[5].label = "Les documents RH dans eDossierPNC";
    helpAsset[5].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[5].lastUpdateDate = "2020-09-29T00:00:00Z";

    const pdf7 = "JDB-dans-eDossierPNC-V2.pdf";
    helpAsset[6] = new HelpAssetModel();
    helpAsset[6].url = `${this.pdfUrl}/cadre/${pdf7}`;
    helpAsset[6].label = "Le journal de bord dans eDossierPNC";
    helpAsset[6].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[6].lastUpdateDate = "2019-10-22T00:00:00Z";
    const pdf8 = "Prepa-express-vol-de-formation-CC.pdf";
    helpAsset[7] = new HelpAssetModel();
    helpAsset[7].url = `${this.pdfUrl}/cadre/${pdf8}`;
    helpAsset[7].label = "Prepa Express Vol de Formation CC";
    helpAsset[7].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[7].lastUpdateDate = updateDate20230308;
    const pdf9 = "Prepa-express-vol-de-formation-CCP.pdf";
    helpAsset[8] = new HelpAssetModel();
    helpAsset[8].url = `${this.pdfUrl}/cadre/${pdf9}`;
    helpAsset[8].label = "Prepa Express Vol de Formation CCP";
    helpAsset[8].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[8].lastUpdateDate = updateDate20230308;
    const pdf10 = "Prepa-express-vol-de-validation-CC-CCP.pdf";
    helpAsset[9] = new HelpAssetModel();
    helpAsset[9].url = `${this.pdfUrl}/cadre/${pdf10}`;
    helpAsset[9].label = "Prepa Express Vol de Validation CC-CCP";
    helpAsset[9].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[9].lastUpdateDate = updateDate20230308;
    const pdf11 = "Indicateurs_Metier_eDossier_guidelines_20210928.pdf";
    helpAsset[10] = new HelpAssetModel();
    helpAsset[10].url = `${this.pdfUrl}/cadre/${pdf11}`;
    helpAsset[10].label = "Les Indicateurs Métier dans eDossierPNC";
    helpAsset[10].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[10].lastUpdateDate = "2021-10-13T00:00:00Z";

    return helpAsset;
  }

  /**
   * Renvoie la liste des ressources d'aide du pnc
   */
  getCommunHelpAssets(): HelpAssetModel[] {
    const helpAsset = new Array(2);
    helpAsset[0] = new HelpAssetModel();
    helpAsset[0].url = `${this.pdfUrl}/commun/Boite_outils_manager.pdf`;
    helpAsset[0].label = "Boîte à outils Cadres et Managers";
    helpAsset[0].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[0].lastUpdateDate = "2023-01-01T00:00:00Z";
    helpAsset[1] = new HelpAssetModel();
    helpAsset[1].url = `${this.pdfUrl}/commun/Priorités_eDossier_guidelines_V.1.pdf`;
    helpAsset[1].label = "Les priorités dans eDossierPNC";
    helpAsset[1].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[1].lastUpdateDate = "2020-09-29T00:00:00Z";
    helpAsset[2] = new HelpAssetModel();
    helpAsset[2].url = `${this.pdfUrl}/commun/FDP_PNC_pour_eDossier_v2.pdf`;
    helpAsset[2].label = "Fiches de poste PNC";
    helpAsset[2].helpAssetType = HelpAssetTypeEnum.PDF;
    helpAsset[2].lastUpdateDate = "2022-01-18T00:00:00Z";
    return helpAsset;
  }


}
