import { TranslateService } from '@ngx-translate/core';
import { SecMobilService } from './../../services/secMobil.service';
import { PdfFileViewerPage } from './../pdf-file-viewer/pdf-file-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
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
  pdfUrl: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private helpAssetProvider: HelpAssetProvider,
    private secMobilService: SecMobilService,
    private translate: TranslateService) {

    if (this.secMobilService.isBrowser) {
      this.pdfUrl = '../assets/pdf/helpAsset';
    } else {
      this.pdfUrl = './assets/pdf/helpAsset';
    }

  }

  ionViewDidEnter() {
    // On récupère le role du pnc dans les paramètres de navigation
    this.helpAssets = this.getCommunHelpAssets();
    if (this.navParams.get('pncRole') && this.navParams.get('pncRole') === PncRole.MANAGER) {
      this.helpAssets.push(...this.getCADHelpAssets());
    } else if (this.navParams.get('pncRole') && this.navParams.get('pncRole') === PncRole.PNC) {
      this.helpAssets.push(...this.getHSTHelpAssets());
    } else {
      this.helpAssets = [];
    }
  }

  /**
   * renvoie vers la page d'affichage des pdf avec l'url du pdf demandé et le title à afficher
   * @param url URL qui sera ouvert sur le nouvel onglet
   */
  displayHelpAsset(url: string) {
    this.navCtrl.push(PdfFileViewerPage, { pdfSrc: url, title: this.translate.instant('HELP_ASSET_LIST.TITLE') });
  }

  /**
   * renvoie la liste des ressources d'aide du cadre
   */
  getCADHelpAssets(): HelpAsset[] {
    const helpAsset = new Array(3);
    const pdf2 = 'Etapes-du-Bilan-Professionnel-V4.pdf';
    helpAsset[0] = new HelpAsset();
    helpAsset[0].url = `${this.pdfUrl}/cadre/${pdf2}`;
    helpAsset[0].label = 'Etapes du Bilan Professionnel V4';
    helpAsset[0].lastUpdateDate = '2018-07-30T13:11:52';
    const pdf3 = 'Livret-instructeur-V6-22juin.pdf';
    helpAsset[1] = new HelpAsset();
    helpAsset[1].url = `${this.pdfUrl}/cadre/${pdf3}`;
    helpAsset[1].label = 'Livret instructeur V6';
    helpAsset[1].lastUpdateDate = '2018-07-30T13:11:52';
    const pdf4 = 'Mode-opératoire-Journal-de-bord.pdf';
    helpAsset[2] = new HelpAsset();
    helpAsset[2].url = `${this.pdfUrl}/cadre/${pdf4}`;
    helpAsset[2].label = 'Mode opératoire, Journal de bord';
    helpAsset[2].lastUpdateDate = '2018-07-30T13:11:52';
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
    helpAsset[0].lastUpdateDate = '2018-07-30T13:11:52';
    return helpAsset;
  }
}
