import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HrDocumentModeEnum } from '../../../../core/enums/hr-document/hr-document-mode.enum';
import { HrDocumentModel } from '../../../../core/models/hr-document/hr-document.model';
import {
    OnlineHrDocumentService
} from '../../../../core/services/hr-documents/online-hr-document.service';
import { SessionService } from '../../../../core/services/session/session.service';
import { HrDocumentComponent } from '../../components/hr-document/hr-document.component';

@Component({
    selector: 'hr-document-create',
    templateUrl: 'hr-document-create.page.html',
})
export class HrDocumentCreatePage implements OnInit {

    mode: HrDocumentModeEnum;
    hrDocument: HrDocumentModel;

    HrDocumentModeEnum = HrDocumentModeEnum;

    @ViewChild('hrDocumentCreateOrUpdate', { static: false }) hrDocumentCreateOrUpdate: HrDocumentComponent;

    constructor(
        private activatedRoute: ActivatedRoute,
        private onlineHrDocumentService: OnlineHrDocumentService) {
    }

    ngOnInit() {
        const id = +this.activatedRoute.snapshot.paramMap.get('hrDocumentId');
        this.mode = id > 0 ? HrDocumentModeEnum.EDITION : HrDocumentModeEnum.CREATION;
        if (this.mode === HrDocumentModeEnum.EDITION) {
            this.onlineHrDocumentService.getHrDocument(id).then(hrDocument => {
                this.hrDocument = hrDocument;
            }, error => {
            });

        }
    }

    loadingIsOver() {
        return this.mode === HrDocumentModeEnum.CREATION || this.hrDocument && this.hrDocument !== undefined;
    }

    /**
     * Vérifie si l'on peut quitter la page
     * @return true si le formulaire n'a pas été modifié
     */
    canDeactivate(): boolean {
        if (this.hrDocumentCreateOrUpdate) {
            return this.hrDocumentCreateOrUpdate.canDeactivate();
        } else {
            return true;
        }
    }
}
