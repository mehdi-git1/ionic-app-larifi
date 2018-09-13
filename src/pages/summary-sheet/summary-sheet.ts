import { Utils } from './../../common/utils';
import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { SummarySheetProvider } from '../../providers/summary-sheet/summary-sheet';

@Component({
    selector: 'page-summary-sheet',
    templateUrl: 'summary-sheet.html',
})

export class SummarySheetPage {

    public previewSrc: string;

    constructor(
        public navParams: NavParams,
        private summarySheetProvider: SummarySheetProvider) {
    }

    ionViewDidEnter() {
        this.initPage();
    }

    /**
     * Initialisation du contenu de la page.
     */
    initPage() {
        const matricule = this.navParams.get('matricule');
        this.summarySheetProvider.getSummarySheet(matricule).then(summarySheet => {
            try {
                if (summarySheet && summarySheet.summarySheet) {
                    const file = new Blob([Utils.base64ToArrayBuffer(summarySheet.summarySheet)], { type: 'application/pdf' });
                    this.previewSrc = URL.createObjectURL(file);
                } else {
                    this.previewSrc = null;
                }
            } catch (error) {
                console.error('createObjectURL error:' + error);
            }
        }, error => {
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.previewSrc !== undefined;
    }
}
