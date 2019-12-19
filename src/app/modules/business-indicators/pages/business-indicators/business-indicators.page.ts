import { AppConstant } from './../../../app.constant';
import { FlightActivityModule } from './../../flight-activity/flight-activity.module';
import { FlightCardModel } from './../../../core/models/business-indicator/flight.card.model';
import { BusinessIndicatorModel } from './../../../core/models/business-indicator/business-indicator.model';
import { OnlineBusinessIndicatorService } from './../../../core/services/business-indicator/online-business-indicator.service';
import { PncService } from './../../../core/services/pnc/pnc.service';
import { PncModel } from './../../../core/models/pnc.model';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sort, MatSort, MatTable, MatPaginator, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';
@Component({
    selector: 'page-business-indicators',
    templateUrl: 'business-indicators.page.html',
    styleUrls: ['./business-indicators.page.scss']
})
export class BusinessIndicatorsPage implements AfterViewInit {

    pageSize = 20;
    totalElements: number;

    TabHeaderEnum = TabHeaderEnum;
    pnc: PncModel;
    businessIndicator: BusinessIndicatorModel;
    sortedFlightCards: FlightCardModel[];

    flightCardsColumns: string[] = ['flightNumber', 'flightDate', 'stations', 'eScore', 'flightActionsNumber'];

    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild(MatTable, {static: false}) table: MatTable<any>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    dataSource: MatTableDataSource<FlightCardModel>;

    constructor(private activatedRoute: ActivatedRoute, private pncService: PncService,
                public onlineBusinessIndicatorService: OnlineBusinessIndicatorService) {
    }

    ngAfterViewInit() {
        const matricule = this.pncService.getRequestedPncMatricule(this.activatedRoute);
        this.pncService.getPnc(matricule).then(pnc => {
            this.pnc = pnc;
        }, error => { });
        this.onlineBusinessIndicatorService.getBusinessIndicator(matricule).then(businessIndicator => {
            this.businessIndicator = businessIndicator;
            if (businessIndicator) {
                this.sortedFlightCards = businessIndicator.flightDetailsCards;
                this.totalElements = this.sortedFlightCards.length;
                this.dataSource = new MatTableDataSource<FlightCardModel>(this.sortedFlightCards);
                this.dataSource.paginator = this.paginator;
                this.dataSource._updateChangeSubscription();
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

        this.sortedFlightCards = this.businessIndicator.flightDetailsCards.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'flightNumber': return this.compare(a.flightNumber, b.flightNumber, isAsc);
            case 'flightDate': return this.compareDate(a.plannedDepartureDate, b.plannedDepartureDate, isAsc);
            case 'eScore': return this.compare(a.escore, b.escore, isAsc);
            case 'flightActionsNumber': return this.compare(a.flightActionsTotalNumber, b.flightActionsTotalNumber, isAsc);
            default: return 0;
          }
        });
        this.dataSource._updateChangeSubscription();
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

    compareDate(a: Date, b: Date, isAsc: boolean) {
        return (moment(a, AppConstant.isoDateFormat).isBefore(moment(b, AppConstant.isoDateFormat)) ? -1 : 1) * (isAsc ? 1 : -1);
    }
}