import * as moment from 'moment';
import { HaulTypeEnum } from 'src/app/core/enums/haul-type.enum';
import { SpecialityEnum } from 'src/app/core/enums/speciality.enum';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
    MatPaginator, MatSort, MatTable, MatTableDataSource, PageEvent, Sort
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { AppConstant } from '../../../../app.constant';
import {
    BusinessIndicatorLightModel
} from '../../../../core/models/business-indicator/business-indicator-light.model';
import {
    BusinessIndicatorSummaryModel
} from '../../../../core/models/business-indicator/business-indicator-summary.model';
import {
    BusinessIndicatorModel
} from '../../../../core/models/business-indicator/business-indicator.model';
import { PncModel } from '../../../../core/models/pnc.model';
import {
    BusinessIndicatorService
} from '../../../../core/services/business-indicator/business-indicator.service';
import {
    BusinessIndicatorFlightLegendComponent
} from '../../components/business-indicator-flight-legend/business-indicator-flight-legend.component';

@Component({
    selector: 'page-business-indicators',
    templateUrl: 'business-indicators.page.html',
    styleUrls: ['./business-indicators.page.scss']
})
export class BusinessIndicatorsPage implements AfterViewInit {

    pageSize = 20;

    TabHeaderEnum = TabHeaderEnum;
    pnc: PncModel;
    businessIndicatorSummary: BusinessIndicatorSummaryModel;
    businessIndicators: BusinessIndicatorLightModel[];

    businessIndicatorColumns: string[] = ['flightNumber', 'flightDate', 'stations', 'aboardFunction', 'eScore', 'flightActionsNumber'];

    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatTable, { static: false }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    dataSource: MatTableDataSource<BusinessIndicatorLightModel>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pncService: PncService,
        private businessIndicatorService: BusinessIndicatorService,
        private connectivityService: ConnectivityService,
        private popoverCtrl: PopoverController
    ) {
    }

    ngAfterViewInit() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        });

        this.businessIndicatorService.getBusinessIndicatorSummary(matricule).then(businessIndicatorSummary => {
            this.businessIndicatorSummary = businessIndicatorSummary;
        });

        this.businessIndicatorService.findPncBusinessIndicators(matricule).then(businessIndicators => {
            this.businessIndicators = businessIndicators;
            this.getBusinessIndicatorsByPage(0);
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc !== undefined && this.businessIndicators !== undefined && this.businessIndicatorSummary !== undefined;
    }

    /**
     * Trie les indicateurs métier
     * @param sort évènement de tri
     */
    sortBusinessIndicators(sort: Sort) {
        if (!this.businessIndicators || !sort.active || sort.direction === '') {
            return;
        }

        this.businessIndicators = this.businessIndicators.sort((businessIndicator1, businessIndicator2) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'flightNumber':
                    return this.compare(businessIndicator1.flight.number, businessIndicator2.flight.number, isAsc);
                case 'flightDate':
                    return this.compareDate(this.getPlannedDepartureDate(businessIndicator1),
                        this.getPlannedDepartureDate(businessIndicator2), isAsc);
                case 'aboardFunction':
                    return this.compare(businessIndicator1.aboardSpeciality, businessIndicator2.aboardSpeciality, isAsc);
                case 'eScore':
                    return this.compare(businessIndicator1.escore, businessIndicator2.escore, isAsc);
                case 'flightActionsNumber':
                    return this.compare(businessIndicator1.flightActionsTotalNumber, businessIndicator2.flightActionsTotalNumber, isAsc);
                default: return 0;
            }
        });
        this.getBusinessIndicatorsByPage(0);
    }

    /**
     * Calcule la date de départ plannifiée du vol d'un indicateur métier : date de départ du tronçon - d0
     * @param businessIndicator l'indicateur métier du vol dont on souhaite calculer la date planifiée
     * @return la date de départ planifiée du vol
     */
    getPlannedDepartureDate(businessIndicator: BusinessIndicatorLightModel): Date {
        if (!businessIndicator) {
            return null;
        }
        return moment(businessIndicator.flight.legDepartureDate, AppConstant.isoDateFormat)
            .subtract(businessIndicator.flight.d0, 'minutes').toDate();
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        if ((!a || a === undefined) && b) {
            return -1 * (isAsc ? 1 : -1);
        }
        if (a && (!b || b === undefined)) {
            return 1 * (isAsc ? 1 : -1);
        }
        if ((!a || a === undefined) && (!b || b === undefined)) {
            return -1 * (isAsc ? 1 : -1);
        }
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    /**
     * Compare 2 dates
     * @param firstDate première date
     * @param secondDate seconde date
     * @param isAsc true, si comparaison ascendante. False sinon
     */
    compareDate(firstDate: Date, secondDate: Date, isAsc: boolean) {
        return (moment(firstDate, AppConstant.isoDateFormat)
            .isBefore(moment(secondDate, AppConstant.isoDateFormat)) ? -1 : 1) * (isAsc ? 1 : -1);
    }

    /**
     * Dirige vers le détail d'un indicateur métier
     * @param businessIndicator l'indicateur métier qu'on souhaite consulter
     */
    goToBusinessIndicatorDetail(businessIndicator: BusinessIndicatorModel) {
        this.router.navigate(['detail', businessIndicator.techId], { relativeTo: this.activatedRoute });
    }

    /**
     * Gère les évènements liés aux changements de page
     * @param event évènement déclenché
     */
    handlePage(event: PageEvent) {
        this.getBusinessIndicatorsByPage(event.pageIndex);
    }

    /**
     * Récupère uniquement les indicateurs métier d'une page
     * @param pageIndex index de la page
     */
    getBusinessIndicatorsByPage(pageIndex: number) {
        const startIndex = pageIndex * this.pageSize;
        const endIndex = (pageIndex + 1) * this.pageSize;
        if (this.businessIndicators) {
            let businessIndicatorsPage = this.businessIndicators.slice(startIndex, endIndex);
            businessIndicatorsPage = this.preProcessBusinessIndicators(businessIndicatorsPage);
            this.dataSource = new MatTableDataSource<BusinessIndicatorLightModel>(businessIndicatorsPage);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource._updateChangeSubscription();
        } else {
            this.dataSource = new MatTableDataSource<BusinessIndicatorLightModel>();
        }
    }

    /**
     * Effectue les opérations de pre processing (pour affichage/tri) sur la liste des indicateurs métier passés en paramètre
     * @param businessIndicators la liste des indicateurs à traiter
     * @return la liste des indicateurs traitée
     */
    preProcessBusinessIndicators(businessIndicators: Array<BusinessIndicatorLightModel>): Array<BusinessIndicatorLightModel> {
        businessIndicators.forEach(businessIndicator => {
            // On indique une valeur négative pour que le tri soit cohérent à l'affichage (valeur remplacée par NA à l'affichage)
            businessIndicator.flightActionsTotalNumber =
                this.isCcLc(businessIndicator) ? -1 : businessIndicator.flightActionsTotalNumber;
        });

        return businessIndicators;
    }

    /**
     * Vérifie si le PNC a occupé un poste de CC sur un vol LC
     * @param businessIndicator l'indicateur métier portant sur le vol à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isCcLc(businessIndicator: BusinessIndicatorLightModel): boolean {
        return businessIndicator.aboardSpeciality === SpecialityEnum.CC
            && businessIndicator.flight.haulType === HaulTypeEnum.LC;
    }

    /**
     * Vérifie si le PNC est CC et vole sur LC
     * @return vrai si c'est le cas, faux sinon
     */
    isPncCcLc() {
        return this.pncService.isCcLc(this.pnc);
    }

    /**
     * Vérifie si l'on est connecté
     * @return true si on est connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }

    /**
     * Affiche le popup de légende
     * @param event l'événement déclencheur
     */
    showLegend(event: any) {
        this.popoverCtrl.create({
            component: BusinessIndicatorFlightLegendComponent,
            event: event,
            translucent: true,
            componentProps: { hasNeverFlownAsCcLc: this.hasNeverFlownAsCcLc() }
        }).then(popover => {
            popover.present();
        });
    }

    /**
     * Vérifie si parmi tous les vols, le PNC n'a jamais volé en tant que CC sur LC
     * @return vrai si c'est le cas, faux sinon
     */
    hasNeverFlownAsCcLc(): boolean {
        return this.businessIndicators.every(businessIndicator => !this.isCcLc(businessIndicator));
    }

    /**
     * Teste si la valeur existe
     * @param value la valeur à tester
     * @return vrai si c'est le cas, faux sinon
     */
    isDefined(value: any): boolean {
        return value !== undefined;
    }


}
