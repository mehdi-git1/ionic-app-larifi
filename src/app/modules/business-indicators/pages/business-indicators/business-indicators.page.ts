import { AppConstant } from './../../../../app.constant';
import { OnlineBusinessIndicatorService } from './../../../../core/services/business-indicator/online-business-indicator.service';
import { PncService } from 'src/app/core/services/pnc/pnc.service';
import { FlightCardModel } from './../../../../core/models/business-indicator/flight-card.model';
import { BusinessIndicatorModel } from './../../../../core/models/business-indicator/business-indicator.model';
import { PncModel } from './../../../../core/models/pnc.model';

import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { Component, ViewChild, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sort, MatSort, MatTable, MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import * as moment from 'moment';
@Component({
    selector: 'page-business-indicators',
    templateUrl: 'business-indicators.page.html',
    styleUrls: ['./business-indicators.page.scss']
})
export class BusinessIndicatorsPage implements AfterViewInit {

    pageSize = 20;

    TabHeaderEnum = TabHeaderEnum;
    pnc: PncModel;
    businessIndicator: BusinessIndicatorModel;
    sortedFlightCards: FlightCardModel[];

    flightCardsColumns: string[] = ['flightNumber', 'flightDate', 'stations', 'eScore', 'flightActionsNumber'];

    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild(MatTable, {static: false}) table: MatTable<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    dataSource: MatTableDataSource<FlightCardModel>;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private pncService: PncService,
                public onlineBusinessIndicatorService: OnlineBusinessIndicatorService) {
    }

    ngAfterViewInit() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.onlineBusinessIndicatorService.getBusinessIndicator(matricule).then(businessIndicator => {
            this.businessIndicator = businessIndicator;
            if (businessIndicator && businessIndicator.flightCards) {
                this.sortedFlightCards = businessIndicator.flightCards;
                this.getFlightCardsByPage(0);
            }
        });
    }

    /**
     * Vérifie que le chargement est terminé
     * @return true si c'est le cas, false sinon
     */
    loadingIsOver(): boolean {
        return this.pnc && !!this.businessIndicator &&  !!this.sortedFlightCards;
    }

    /**
     * Trie les données
     * @param sort évènement de tri
     */
    sortFlightCards(sort: Sort) {
        if (!this.businessIndicator || !sort.active || sort.direction === '') {
          return;
        }

        this.sortedFlightCards = this.businessIndicator.flightCards.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'flightNumber': return this.compare(a.flightNumber, b.flightNumber, isAsc);
            case 'flightDate': return this.compareDate(a.plannedDepartureDate, b.plannedDepartureDate, isAsc);
            case 'eScore': return this.compare(a.escore, b.escore, isAsc);
            case 'flightActionsNumber': return this.compare(a.flightActionsTotalNumber, b.flightActionsTotalNumber, isAsc);
            default: return 0;
          }
        });
        this.getFlightCardsByPage(0);
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        if ((!a || a === undefined) && b ) {
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
        return (moment(firstDate, AppConstant.isoDateFormat).isBefore(moment(secondDate, AppConstant.isoDateFormat)) ? -1 : 1) * (isAsc ? 1 : -1);
    }

    /**
     * Dirige vers la fiche détail vol
     * @param flightCard la fiche de vol
     */
    goToFlightDetailsCard(flightCard: FlightCardModel) {
        this.router.navigate(['flight-details-card', flightCard.techId], { relativeTo: this.activatedRoute });
    }

    /**
     * Gère les évènements liés aux changements de page
     * @param event évènement déclenché
     */
    public handlePage(event: PageEvent) {
        this.getFlightCardsByPage(event.pageIndex);
    }

    /**
     * Récupère uniquement les fiches de vol de la page
     * @param pageIndex index de la page
     */
    public getFlightCardsByPage(pageIndex: number) {
        const startIndex = pageIndex * this.pageSize;
        const endIndex = (pageIndex + 1) * this.pageSize - 1;
        const flightCardByPage = this.sortedFlightCards.slice(startIndex, endIndex);
        this.dataSource = new MatTableDataSource<FlightCardModel>(flightCardByPage);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource._updateChangeSubscription();
    }

}
