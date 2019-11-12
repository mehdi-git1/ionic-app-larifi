import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TextEditorModeEnum } from '../../../../core/enums/text-editor-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import { SecurityService } from '../../../../core/services/security/security.service';

@Component({
    selector: 'hr-document-card',
    templateUrl: 'hr-document-card.component.html',
    styleUrls: ['./hr-document-card.component.scss']
})
export class HrDocumentCardComponent {

    @Input() hrDocument: HrDocumentModel;

    TextEditorModeEnum = TextEditorModeEnum;

    constructor(
        private securityService: SecurityService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {

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
        this.router.navigate(['../..', 'create', this.hrDocument.techId], { relativeTo: this.activatedRoute });
    }


}
