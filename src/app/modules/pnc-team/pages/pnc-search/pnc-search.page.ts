import { from, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { PagedPncModel } from 'src/app/core/models/paged-pnc.model';
import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';
import { SortChange, SortOption } from 'src/app/shared/components/sort-list/sort-list.component';

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { PagePositionEnum } from '../../../../core/enums/page-position.enum';
import { PncSearchModeEnum } from '../../../../core/enums/pnc-search-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { Events } from '../../../../core/services/events/events.service';
import { PncPhotoService } from '../../../../core/services/pnc-photo/pnc-photo.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'page-pnc-search',
  templateUrl: 'pnc-search.page.html',
  styleUrls: ['./pnc-search.page.scss']
})
export class PncSearchPage {

  searchMode: PncSearchModeEnum;
  pnc: PncModel;
  filteredPncs = new Array<PncModel>();
  filters = new PncFilterModel();
  filtersSubject = new Subject<PncFilterModel>();

  totalPncs = 0;
  isMenuOpened = false;
  isLoading = true;
  searchInProgress = false;

  enabledFiltersCount = 0;

  sortOptions: Array<SortOption>;

  // Expose l'enum au template
  TabHeaderEnum = TabHeaderEnum;

  constructor(
    private pncService: PncService,
    private pncPhotoService: PncPhotoService,
    private sessionService: SessionService,
    private events: Events,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.initFilters();
    this.initSortOptions();

    this.filtersSubject.pipe(switchMap((filters) => this.handlePncSearch(filters)))
      .subscribe(pagedPnc => {
        this.handlePncSearchResponse(pagedPnc);
      });

    this.searchMode = this.activatedRoute.snapshot.paramMap.get('mode') ?
      PncSearchModeEnum[this.activatedRoute.snapshot.paramMap.get('mode')]
      : PncSearchModeEnum.FULL;
  }

  /**
   * Initialise l'objet contenant les filtres, avec les paramètres de base de pagination et de tri
   */
  initFilters() {
    this.filters.size = AppConstant.PAGE_SIZE;
    this.filters.sortColumn = 'lastName';
    this.filters.sortDirection = SortDirection.ASC;
  }

  /**
   * Initialise les options de tri
   */
  initSortOptions() {
    this.sortOptions = [
      {
        value: 'lastName',
        label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_NAME')
      },
      {
        value: 'lastEObservationDate',
        label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_EOBSERVATION')
      },
      {
        value: 'lastProfessionalInterviewDate',
        label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_PROFESSIONAL_INTERVIEW')
      },
      {
        value: 'lastCareerObjectiveUpdateDate',
        label: this.translateService.instant('GLOBAL.SORT_LIST.LAST_UPDATED_CAREER_OBJECTIVE')
      }
    ];
  }

  /**
   * Lance une recherche avec de nouveaux filtres
   * @param filters l'objet contenant les filtres à appliquer à la recherche
   */
  searchByFilters(filters: PncFilterModel) {
    this.filters = Object.assign(this.filters, filters);
    this.launchSearch();
  }

  /**
   * Réinitialise la recherche
   * @param filters l'objet contenant les filtres à appliquer à la recherche
   */
  reinitializeSearch(filters: PncFilterModel) {
    this.initFilters();
    this.searchByFilters(filters);
  }

  /**
   * Lance la recherche
   */
  launchSearch() {
    this.filters.pagePosition = PagePositionEnum.FIRST;
    this.filtersSubject.next(this.filters);
  }

  /**
   * Vérifie si des pnc sont présents
   * @return vrai si c'est le cas, faux sinon
   */
  hasPncs(): boolean {
    return this.filteredPncs && this.filteredPncs.length > 0;
  }

  /**
   * Charge la page suivante
   */
  loadNextPage() {
    this.filters.pagePosition = PagePositionEnum.NEXT;
    this.filtersSubject.next(this.filters);
  }

  /**
   * Gère l'affichage de l'effectif à afficher en fonction des filtres
   * @param filter les filtres à appliquer
   * @Return la liste de PNC filtrée
   */
  handlePncSearch(filters: PncFilterModel): Observable<PagedPncModel> {
    if (filters.pagePosition === PagePositionEnum.FIRST) {
      this.resetPageNumber();
      this.isLoading = true;
      this.isMenuOpened = false;
      return this.getFilteredPncs(filters);
    } else {
      if (this.totalPncs === undefined || this.filters.page < (this.totalPncs / AppConstant.PAGE_SIZE)) {
        this.filters.page++;
        this.filters.offset = this.filters.page * this.filters.size;
        return this.getFilteredPncs(filters);
      }
    }

    return new Observable();
  }

  /**
   * Récupère les pnc correspondants au filtre.
   * @param filter les filtres à appliquer
   * @Return la liste de PNC filtrée
   */
  getFilteredPncs(filters: PncFilterModel): Observable<PagedPncModel> {
    this.searchInProgress = true;
    return from(this.pncService.getFilteredPncs(filters)
      .then((pagedPncSearched) => {
        return pagedPncSearched;
      }).catch(error => {
        return error;
      }));
  }

  /**
   * Remet à zéro le numéro de page
   */
  resetPageNumber() {
    this.filters.offset = 0;
    this.filters.page = 0;
  }

  /**
   * Gère L'affichage du contenu de la page
   * @param pagedPncs le contenu de la page filtrée à afficher
   */
  handlePncSearchResponse(pagedPncs: any) {
    if (pagedPncs !== null) {
      this.pncPhotoService.synchronizePncsPhotos(pagedPncs.content.map(pnc => pnc.matricule));
      if (this.filters.pagePosition === PagePositionEnum.NEXT) {
        this.filteredPncs = this.filteredPncs.concat(pagedPncs.content);
      } else {
        this.filteredPncs = pagedPncs.content;
      }
      this.totalPncs = pagedPncs.page.totalElements;
      this.isLoading = false;
    }
    this.searchInProgress = false;
  }

  /**
   * Effectue le tri selon la colonne choisie
   * @param sortChange les options de tri
   */
  sortCrewList(sortChange: SortChange) {
    this.filters.sortColumn = sortChange.value;
    this.filters.sortDirection = sortChange.direction;
    this.launchSearch();
  }

  /**
   * Assigne la valeur du nombre de filtres activés
   * @param enabledFiltersCount le nombre de filtres activés
   */
  setEnabledFiltersCount(enabledFiltersCount: number) {
    this.enabledFiltersCount = enabledFiltersCount;
  }
  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: PncModel) {
    // Si on va sur un PNC par la recherche, on suprime de la session une enventuelle rotation.
    this.sessionService.appContext.lastConsultedRotation = null;
    if (this.searchMode === PncSearchModeEnum.ALTERNANT) {
      this.router.navigate(['visit', pnc.matricule, 'development-program']);
    } else {
      this.events.publish('EDossier:visited', { visitedPnc: pnc });
    }
  }


  /**
   * Vérifie si on est sur la recherche d'alternant
   * @return vrai si on est sur la recherche d'alternant, faux sinon
   */
  isAlternantSearch() {
    return this.searchMode === PncSearchModeEnum.ALTERNANT;
  }

  /**
   * Ouvre/ferme le menu latéral contenant les filtres
   */
  toggleFiltersMenu() {
    this.isMenuOpened = !this.isMenuOpened;
  }

  /**
   * Vérifie que la recherche est terminée (que toutes les pages ont été remontées)
   * @return vrai si la recherche est terminée, faux sinon
   */
  isSearchOver() {
    return this.totalPncs === this.filteredPncs.length;
  }
}
