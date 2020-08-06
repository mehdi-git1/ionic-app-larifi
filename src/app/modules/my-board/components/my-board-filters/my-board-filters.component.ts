import {
    MyBoardNotificationFilterModel
} from 'src/app/core/models/my-board/my-board-notification-filter.model';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { SessionService } from '../../../../core/services/session/session.service';

@Component({
    selector: 'my-board-filters',
    templateUrl: './my-board-filters.component.html',
    styleUrls: ['./my-board-filters.component.scss'],
})
export class MyBoardFiltersComponent implements OnInit {

    @Input() filters: MyBoardNotificationFilterModel;
    @Output() filtersChanged = new EventEmitter<MyBoardNotificationFilterModel>();

    filterForm: FormGroup;

    documentTypes: Array<any>;

    constructor(
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private translateService: TranslateService

    ) {
        this.documentTypes = this.initDocumentTypes();

        this.initForm();
    }

    ngOnInit() {
    }

    /**
     * Initialise le formulaire
     */
    initForm() {
        this.filterForm = this.formBuilder.group({
            documentTypes: [''],
        });
    }

    /**
     * Initialise la liste des types de document
     * @return la liste initialisée
     */
    initDocumentTypes(): Array<any> {
        const documentTypeArray = new Array();
        const documentTypes = this.sessionService.getActiveUser().appInitData.myBoardInitData.notificationDocumentTypes;
        for (const documentType of documentTypes) {
            documentTypeArray.push({
                value: documentType,
                label: this.translateService.instant('MY_BOARD.DOCUMENT_TYPE.' + documentType)
            });
        }
        return this.sortDocumentTypes(documentTypeArray);
    }

    /**
     * Tri une liste de type de document par ordre alphabétique
     * @param documentTypes la liste des documents à trier
     * @return la liste triée
     */
    sortDocumentTypes(documentTypes: Array<any>): Array<any> {
        documentTypes.sort((documentType1, documentType2) => {
            if (documentType1.label.toLowerCase() < documentType2.label.toLowerCase()) {
                return -1;
            }
            if (documentType1.label.toLowerCase() > documentType2.label.toLowerCase()) {
                return 1;
            }
            return 0;
        });
        return documentTypes;
    }

    /**
     * Déclenché quand les types de document sont mis à jour
     * @param event l'événement déclenché
     */
    documentTypesChanged(event) {
        if (event.value !== undefined) {
            this.filters.documentTypes = new Array();
            for (const documentType of event.value) {
                this.filters.documentTypes.push(documentType);
            }
            this.filtersChanged.emit();
        }
    }

}
