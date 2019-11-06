import { NavController } from 'ionic-angular';

import { Component, Input } from '@angular/core';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { SecurityService } from '../../../../core/services/security/security.service';
import { HrDocumentCreatePage } from '../../pages/hr-document-create/hr-document-create.page';

@Component({
    selector: 'hr-document-card',
    templateUrl: 'hr-document-card.component.html',
})
export class HrDocumentCardComponent {

    @Input() hrDocument: HrDocumentModel;

    TextEditorModeEnum = TextEditorModeEnum;

    constructor(private securityService: SecurityService,
        private navCtrl: NavController) {

    }

    /**
     * Vérifie si le PNC est manager
     * @return vrai si le PNC est manager, faux sinon
     */
    isManager(): boolean {
        return this.securityService.isManager();
    }

    /**
     * Dirige vers la page de modification d'un document RH
     */
    editHrDocument() {
        this.navCtrl.push(HrDocumentCreatePage, { mode: HrDocumentModeEnum.EDITION, id: this.hrDocument.techId });
    }


}
