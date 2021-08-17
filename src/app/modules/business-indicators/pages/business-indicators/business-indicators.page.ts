import * as moment from 'moment';
import { from, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  BusinessIndicatorSortColumnEnum
} from 'src/app/core/enums/business-indicators/business-indicators-sort-columns-enum';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

import { AppConstant } from '../../../../app.constant';
import {
  BusinessIndicatorFilterModel
} from '../../../../core/models/business-indicator/business-indicator-filter-model';
import {
  BusinessIndicatorLightModel
} from '../../../../core/models/business-indicator/business-indicator-light.model';
import {
  BusinessIndicatorSummariesModel
} from '../../../../core/models/business-indicator/business-indicator-summaries.model';
import {
  BusinessIndicatorModel
} from '../../../../core/models/business-indicator/business-indicator.model';
import {
  PagedBusinessIndicatorModel
} from '../../../../core/models/business-indicator/paged-businessIndicator.model';
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
export class BusinessIndicatorsPage implements OnInit, AfterViewInit {


  TabHeaderEnum = TabHeaderEnum;
  totalElements: number;
  pnc: PncModel;
  businessIndicatorSummaries: BusinessIndicatorSummariesModel;
  businessIndicators: BusinessIndicatorModel[];
  businessIndicatorsFilter: BusinessIndicatorFilterModel;
  dataSource: MatTableDataSource<BusinessIndicatorModel>;
  businessIndicatorSummariesComparison: BusinessIndicatorSummariesModel[];
  businessIndicatorColumns: string[] = ['flightNumber', 'flightDate', 'stations', 'aboardFunction', 'eScore', 'flightActionsNumber'];
  businessIndicatorRequestSubject: Subject<any>;
  isFilterOpened = false;
  disabledComparisonLaunchButton = false;

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

    this.businessIndicatorService.getBusinessIndicatorSummaries(matricule).then(businessIndicatorSummaries => {
      this.businessIndicatorSummaries = businessIndicatorSummaries;
    });

    this.getIndicatorsByFilter(matricule).subscribe(pagedIndicator => this.processRequestResult(pagedIndicator));
    this.businessIndicatorRequestSubject
      .pipe(switchMap(v => this.getIndicatorsByFilter(matricule)))
      .subscribe(pagedIndicator => this.processRequestResult(pagedIndicator));
  }

  ngOnInit(): void {
    this.businessIndicatorsFilter = new BusinessIndicatorFilterModel();
    this.businessIndicatorsFilter.size = AppConstant.PAGE_SIZE;
    this.businessIndicatorsFilter.page = 0;
    this.dataSource = new MatTableDataSource<BusinessIndicatorModel>(this.businessIndicators);
    this.businessIndicatorRequestSubject = new Subject();
  }
  /**
   * Vérifie que le chargement est terminé
   * @return true si c'est le cas, false sinon
   */
  loadingIsOver(): boolean {
    return (this.pnc !== undefined && this.businessIndicators !== undefined && this.businessIndicatorSummaries !== undefined);
  }

  /**
   * Trie les indicateurs métier
   * @param sort évènement de tri
   */
  sortBusinessIndicators(sort: Sort) {
    const activeColumn = sort.active;
    switch (activeColumn) {
      case 'flightNumber':
        this.businessIndicatorsFilter.sortColumn = BusinessIndicatorSortColumnEnum.FLIGHT_NUMBER;
        break;

      case 'flightDate':
        this.businessIndicatorsFilter.sortColumn = BusinessIndicatorSortColumnEnum.THEORETICAL_DATE;
        break;
      case 'aboardFunction':
        this.businessIndicatorsFilter.sortColumn = BusinessIndicatorSortColumnEnum.ABOARD_SPECIALITY;
        break;
      case 'eScore':
        this.businessIndicatorsFilter.sortColumn = BusinessIndicatorSortColumnEnum.ESCORE;
        break;
      default:
        this.businessIndicatorsFilter.sortColumn = BusinessIndicatorSortColumnEnum.FLIGHT_ACTIONS_NUMBER;
        break;
    }
    this.businessIndicatorsFilter.sortDirection = sort.direction === 'asc' ? SortDirection.ASC : SortDirection.DESC;
    this.businessIndicatorRequestSubject.next();

  }


  /**
   * Réinitialise le tableau contenant les données
   * de comparaison.
   */
  reinitSummariesComparisonData() {
    this.businessIndicatorSummariesComparison = [];
  }

  /**
   * Lance la comparaison des différentes périodes
   * @param filter les filtres à appliquer
   */
  launchComparison(filter: BusinessIndicatorFilterModel) {
    this.businessIndicatorsFilter = filter;
    this.disabledComparisonLaunchButton = true;
    this.businessIndicatorService.getBusinessIndicatorSummariesByFilter(this.pnc.matricule, filter)
      .then((businessIndicatorSummariesComparison) => {
        this.isFilterOpened = false;
        this.disabledComparisonLaunchButton = false;
        this.businessIndicatorSummariesComparison = businessIndicatorSummariesComparison;
      });
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
    this.businessIndicatorsFilter.page = event.pageIndex;
    this.businessIndicatorRequestSubject.next();
  }

  /**
  * traite le resultat de la réquete
  * de récherche d'indicateurs métiers.
  *
  * @param businessIndicators la liste des indicateurs metiers reçus.
  */
  processRequestResult(pagedBusinessIndicators: PagedBusinessIndicatorModel): void {
    this.businessIndicators = pagedBusinessIndicators.content;
    this.dataSource.data = this.businessIndicators;
    this.totalElements = pagedBusinessIndicators.totalElements;
  }

  /**
   * Définit si le panneau de filtre est ouvert ou non.
   * @param isOpened indiquant si l'on souhaite ouvrir ou non le panneau
   */
  setFilterContainerState(isOpened: boolean): void {
    this.isFilterOpened = isOpened;
  }

  /**
 * Affiche le popup de légende
 * @param event l'événement déclencheur
 */
  showLegend(event: any) {

    this.popoverCtrl.create({
      component: BusinessIndicatorFlightLegendComponent,
      event,
      translucent: true,
      componentProps: { hasNeverFlownAsCcLcDuringPastYear: this.businessIndicatorSummaries.hasNeverFlownAsCcLcDuringPastYear }
    }).then(popover => {
      popover.present();
    });
  }

  /**
 * Recupère les indicateurs metiers du pnc.
 * @param matricule le matricule du pnc
 * @return un observable contenant
 * les indicateurs metiers dans la requete.
 */
  getIndicatorsByFilter(matricule: string): Observable<PagedBusinessIndicatorModel> {
    return from(
      this.businessIndicatorService.findPncBusinessIndicators
        (matricule, this.businessIndicatorsFilter)
    );
  }


  /**
   * Vérifie si le PNC a occupé un poste de CC sur un vol LC
   * @param businessIndicator l'indicateur métier portant sur le vol à tester
   * @return vrai si c'est le cas, faux sinon
   */
  isCcLc(businessIndicator: BusinessIndicatorLightModel): boolean {
    return businessIndicator.flightActionsTotalNumber === - 1;
  }

  /**
   * Vérifie si l'on est connecté
   * @return true si on est connecté, false sinon
   */
  isConnected(): boolean {
    return this.connectivityService.isConnected();
  }


  /**
   * @return le nombre d'élements maximum
   * affiché par page.
   */
  getPageSize(): number {
    return this.businessIndicatorsFilter.size;
  }

  /**
   * Le nombre total d'élements
   * correspondant au filtre.
   */
  getTotalElements(): number {
    return this.totalElements;
  }

}
