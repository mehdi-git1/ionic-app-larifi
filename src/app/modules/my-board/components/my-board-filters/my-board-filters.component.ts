import * as moment from 'moment';
import {
    MyBoardNotificationFilterModel
} from 'src/app/core/models/my-board/my-board-notification-filter.model';

import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import {
    MyBoardNotificationSummaryModel
} from '../../../../core/models/my-board/my-board-notification-summary.model';
import { SessionService } from '../../../../core/services/session/session.service';
import { FormsUtil } from '../../../../shared/utils/forms-util';
import { Utils } from '../../../../shared/utils/utils';

@Component({
    selector: 'my-board-filters',
    templateUrl: './my-board-filters.component.html',
    styleUrls: ['./my-board-filters.component.scss'],
})
export class MyBoardFiltersComponent implements AfterViewInit {

    @Input() filters: MyBoardNotificationFilterModel;
    @Input() notificationSummary: MyBoardNotificationSummaryModel;

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

    ngAfterViewInit() {
        this.resetFilters();
    }

    /**
     * Initialise le formulaire
     */
    initForm() {
        const dateRangeValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
            const creationStartDate = formGroup.get('creationStartDate');
            const creationEndDate = formGroup.get('creationEndDate');
            if (!creationStartDate || !creationEndDate) {
                return null;
            }
            if (moment(creationStartDate.value).isAfter(moment(creationEndDate.value))) {
                return { startDateAfterEndDate: this.translateService.instant('MY_BOARD.MESSAGES.ERROR.START_DATE_AFTER_END_DATE') };
            }
            return null;
        };

        this.filterForm = this.formBuilder.group({
            documentTypes: [''],
            creationStartDate: [''],
            creationEndDate: [''],
            archived: [false]
        }, { validators: dateRangeValidator });

        this.filterForm.valueChanges.debounceTime(500).subscribe(newForm => {
            if (this.filterForm.valid) {
                this.filters.documentTypes = [...newForm.documentTypes];
                this.filters.creationStartDate = Utils.isEmpty(newForm.creationStartDate) ? '' : new Date(newForm.creationStartDate)
                    .toISOString();
                this.filters.creationEndDate = Utils.isEmpty(newForm.creationEndDate) ? '' : new Date(newForm.creationEndDate)
                    .toISOString();
                this.filters.archived = newForm.archived;
                this.filtersChanged.next();
            }
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
     * Réinitialise tous les filtres
     */
    resetFilters() {
        this.filters.documentTypes = new Array();
        this.filters.creationStartDate = this.getDefaultCreationStartDate();
        this.filters.creationEndDate = this.getDefaultCreationEndDate();
        this.filters.archived = false;
        FormsUtil.reset(this.filterForm, this.filters);
    }

    /**
     * Récupère la date de début par défaut
     * @return la date de début par défaut
     */
    getDefaultCreationStartDate(): string {
        return moment().subtract(6, 'months').toISOString();
    }

    /**
     * Récupère la date de fin par défaut
     * @return la date de fin par défaut
     */
    getDefaultCreationEndDate(): string {
        return moment().toISOString();
    }

}
