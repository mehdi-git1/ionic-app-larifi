import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import * as moment from 'moment';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
    MatPaginator, MatSort, MatTable, MatTableDataSource, PageEvent, Sort
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

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
    OnlineBusinessIndicatorService
} from '../../../../core/services/business-indicator/online-business-indicator.service';

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

    businessIndicatorColumns: string[] = ['flightNumber', 'flightDate', 'stations', 'eScore', 'flightActionsNumber'];

    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatTable, { static: false }) table: MatTable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    dataSource: MatTableDataSource<BusinessIndicatorLightModel>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private pncService: PncService,
        private onlineBusinessIndicatorService: OnlineBusinessIndicatorService,
        private connectivityService: ConnectivityService
    ) {
    }

    ngAfterViewInit() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        });

        this.onlineBusinessIndicatorService.getBusinessIndicatorSummary(matricule).then(businessIndicatorSummary => {
            this.businessIndicatorSummary = businessIndicatorSummary;
        });

        this.onlineBusinessIndicatorService.findPncBusinessIndicators(matricule).then(businessIndicators => {
            this.businessIndicators = businessIndicators;
            this.getBusinessIndicatorsByPage(0);
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc && this.businessIndicators !== undefined && this.businessIndicatorSummary !== undefined;
    }

    /**
     * Trie les indicateurs métier
     * @param sort évènement de tri
     */
    sortBusinessIndicators(sort: Sort) {
        if (!this.businessIndicators || !sort.active || sort.direction === '') {
            return;
        }

        this.businessIndicators = this.businessIndicators.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'flightNumber':
                    return this.compare(a.flightDetailsCard.flightNumber, b.flightDetailsCard.flightNumber, isAsc);
                case 'flightDate':
                    return this.compareDate(this.getPlannedDepartureDate(a),
                        this.getPlannedDepartureDate(b), isAsc);
                case 'eScore':
                    return this.compare(a.flightDetailsCard.escore, b.flightDetailsCard.escore, isAsc);
                case 'flightActionsNumber':
                    return this.compare(a.flightDetailsCard.flightActionsTotalNumber, b.flightDetailsCard.flightActionsTotalNumber, isAsc);
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
        return moment(businessIndicator.flightDetailsCard.legDepartureDate, AppConstant.isoDateFormat)
            .subtract(businessIndicator.flightDetailsCard.d0, 'minutes').toDate();
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        if ((!a || a === undefined) && b) {
            return 1;
        }
        if (a && (!b || b === undefined)) {
            return -1;
        }
        if ((!a || a === undefined) && (!b || b === undefined)) {
            return -1;
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
        const endIndex = (pageIndex + 1) * this.pageSize - 1;
        if (this.businessIndicators) {
            const flightCardByPage = this.businessIndicators.slice(startIndex, endIndex);
            this.dataSource = new MatTableDataSource<BusinessIndicatorLightModel>(flightCardByPage);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource._updateChangeSubscription();
        } else {
            this.dataSource = new MatTableDataSource<BusinessIndicatorLightModel>();
        }
    }

    /**
     * Vérifie si l'on est connecté
     * @return true si on est connecté, false sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }
}
