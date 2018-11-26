import { Utils } from '../../../../shared/utils/utils';
import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

import { SummarySheetService } from '../../../../core/services/summary-sheet/summary-sheet.service';

@Component({
    selector: 'page-summary-sheet',
    templateUrl: 'summary-sheet.page.html',
})

export class SummarySheetPage {

    public previewSrc: string;

    constructor(
        public navParams: NavParams,
        private summarySheetProvider: SummarySheetService) {
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
