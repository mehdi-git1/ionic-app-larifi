import * as moment from 'moment';

import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import {
    MyBoardNotificationTypeEnum
} from '../../../../core/enums/my-board/my-board-notification-type.enum';
import {
    MyBoardNotificationFilterModel
} from '../../../../core/models/my-board/my-board-notification-filter.model';
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

    @Input() type: MyBoardNotificationTypeEnum;
    @Input() notificationSummary: MyBoardNotificationSummaryModel;

    @Output() filtersChanged = new EventEmitter<MyBoardNotificationFilterModel>();
    @Output() enabledFiltersCountChanged = new EventEmitter<number>();

    filterForm: FormGroup;

    documentTypes: Array<any>;

    MyBoardNotificationTypeEnum = MyBoardNotificationTypeEnum;

    filters = new Map<MyBoardNotificationTypeEnum, MyBoardNotificationFilterModel>();

    constructor(
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private translateService: TranslateService
    ) {
        this.documentTypes = this.initDocumentTypes();

        this.initForm();
        this.onFormValueChange();
    }

    ngAfterViewInit() {
        this.resetFilters();
    }

    /**
     * Initialise les filtres et les champs du formulaire selon le type de notification
     * @param myBoardNotificationType le type de notification myBoard
     */
    updateFilterForm(myBoardNotificationType: MyBoardNotificationTypeEnum) {
        this.filters.set(this.type, this.filterForm.getRawValue());
        this.resetFilters(this.filters.get(myBoardNotificationType));
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

        this.filters.set(MyBoardNotificationTypeEnum.ALERT, this.getFormInitValues());
        this.filters.set(MyBoardNotificationTypeEnum.NOTIFICATION, this.getFormInitValues());
    }

    /**
     * Gère les changements de valeur dans le formulaire
     */
    onFormValueChange() {
        this.filterForm.valueChanges.debounceTime(500).subscribe(newForm => {
            if (this.filterForm.valid) {
                const filters = new MyBoardNotificationFilterModel();
                filters.documentTypes = newForm.documentTypes;
                filters.creationStartDate = Utils.isEmpty(newForm.creationStartDate) ? '' : new Date(newForm.creationStartDate)
                    .toISOString();
                filters.creationEndDate = Utils.isEmpty(newForm.creationEndDate) ? '' : new Date(newForm.creationEndDate)
                    .toISOString();
                filters.archived = newForm.archived;
                this.filtersChanged.next(filters);
            }
            this.countEnabledFilters();
        });
    }

    /**
     * compte le nombre de filtres activés dans le formulaire
     */
    countEnabledFilters() {
        const enabledFiltersCount = Object.values(this.filterForm.value)
            .filter((value: string | boolean | Array<string>) => {
                if (typeof value === 'string') {
                    return !Utils.isEmpty(value);
                } else if (typeof value === 'boolean') {
                    return value;
                } else {
                    return value.length;
                }
            }).length;
        this.enabledFiltersCountChanged.emit(enabledFiltersCount);
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
     * @param filters le filtre avec lequel on souhaite initialiser le formulaire
     */
    resetFilters(filters?: MyBoardNotificationFilterModel) {
        this.filterForm.reset(this.getFormInitValues());
        if (filters) {
            FormsUtil.reset(this.filterForm, filters);
        }
        this.countEnabledFilters();
    }

    /**
     * Récupère les valeurs initiales des filtres
     * @return un objet mappant le champs et sa valeur d'initialisation
     */
    getFormInitValues(): MyBoardNotificationFilterModel {
        const newFilter = new MyBoardNotificationFilterModel();
        newFilter.documentTypes = new Array();
        newFilter.creationStartDate = this.getDefaultCreationEndDate();
        newFilter.creationEndDate = this.getDefaultCreationEndDate();
        newFilter.archived = false;
        return newFilter;
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
