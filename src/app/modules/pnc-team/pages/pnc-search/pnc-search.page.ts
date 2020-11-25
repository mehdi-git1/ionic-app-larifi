import { from, Observable, Subject } from 'rxjs';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { PagedPncModel } from 'src/app/core/models/paged-pnc.model';
import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Events } from '@ionic/angular';

import { AppConstant } from '../../../../app.constant';
import { PagePositionEnum } from '../../../../core/enums/page-position.enum';
import { PncSearchModeEnum } from '../../../../core/enums/pnc-search-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { PncPhotoService } from '../../../../core/services/pnc-photo/pnc-photo.service';
import { PncService } from '../../../../core/services/pnc/pnc.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'page-pnc-search',
  templateUrl: 'pnc-search.page.html',
  styleUrls: ['./pnc-search.page.scss']
})
export class PncSearchPage implements AfterViewInit {

  searchInProgress = false;

  searchMode: PncSearchModeEnum;

  pnc: PncModel;

  filteredPncs = new Array<PncModel>();
  public filters = new PncFilterModel();
  filtersSubject = new Subject<PncFilterModel>();

  totalPncs = 0;
  isMenuOpened = false;
  isLoading = true;

  @ViewChild(MatButtonToggleGroup, { static: false })
  sortDirectionToogleGroup: MatButtonToggleGroup;
  enabledFiltersCount = 0;

  // Expose l'enum au template
  TabHeaderEnum = TabHeaderEnum;

  constructor(
    private pncService: PncService,
    private pncPhotoService: PncPhotoService,
    private sessionService: SessionService,
    private events: Events,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    this.filters.size = AppConstant.PAGE_SIZE;
    this.filters.sortColumn = 'lastName';
    this.filters.sortDirection = SortDirection.ASC;
    this.resetPageNumber();

    this.filtersSubject
      .switchMap((filters) => this.handlePncSearch(filters))
      .subscribe(pagedPnc => {
        this.handlePncSearchResponse(pagedPnc);
      });

    this.searchMode = this.activatedRoute.snapshot.paramMap.get('mode') ?
      PncSearchModeEnum[this.activatedRoute.snapshot.paramMap.get('mode')]
      : PncSearchModeEnum.FULL;
  }

  ngAfterViewInit() {
    this.initPage();
  }

  /**
   * Initialisation du contenu de la page.
   */
  initPage() {
    this.resetPageNumber();
    this.launchSearch();
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
  }

  /**
   * Effectue le tri selon la colonne choisie
   * @param value la colonne choisie
   */
  setFilterColumnValue(value: string) {
    this.filters.sortColumn = value;
    this.filters.sortDirection = (this.filters.sortColumn === 'lastName') ? this.filters.sortDirection : SortDirection.ASC;
    this.launchSearch();
  }


  /**
   * Effectue le tri de la colonne choisie selon l'ordre de tri
   */
  sortColumnBySelectedDirection() {
    this.filters.sortDirection = this.sortDirectionToogleGroup.value;
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
      this.events.publish('EDossier:visited', pnc);
    }
  }

  /**
   * Retourne le sens contraire au sens passé en paramètre
   * @param sortDirection le sens dont on veut le contraire
   * @return le sens du tri
   */
  switchSortDirection(sortDirection: SortDirection): SortDirection {
    return (sortDirection === SortDirection.ASC) ? SortDirection.DESC : SortDirection.ASC;
  }

  /**
   *  test si le tri est dans l'ordre croissant
   * @return vrai si l'ordre est croissant, faux sinon.
   */
  isASC(): boolean {
    return this.filters.sortDirection === SortDirection.ASC;
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
   *  deux valeurs et renvois true si elles sont égales
   * @param e1 premiere valeur à comparér
   * @param e2 Deuxieme valeur à comparér
   */
  compareFn(e1: string, e2: string): boolean {
    return (e1 === e2);
  }
}
