import { from, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SortDirection } from 'src/app/core/enums/sort-direction-enum';
import { TabHeaderEnum } from 'src/app/core/enums/tab-header.enum';
import { PagedPncModel } from 'src/app/core/models/paged-pnc.model';
import { PncFilterModel } from 'src/app/core/models/pnc-filter.model';
import { PncLightModel } from 'src/app/core/models/pnc-light.model';
import { ConnectivityService } from 'src/app/core/services/connectivity/connectivity.service';
import { PncCardComponent } from 'src/app/shared/components/pnc-card/pnc-card.component';
import { SortChange, SortOption } from 'src/app/shared/components/sort-list/sort-list.component';

import { Component, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AppConstant } from '../../../../app.constant';
import { PagePositionEnum } from '../../../../core/enums/page-position.enum';
import { PncSearchModeEnum } from '../../../../core/enums/pnc-search-mode.enum';
import { PncModel } from '../../../../core/models/pnc.model';
import { Events } from '../../../../core/services/events/events.service';
import { MailingService } from '../../../../core/services/mailing/mailing.service';
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
  selectPncRecipients = new Set<PncModel>();
  totalPncs = 0;
  isMenuOpened = false;
  isLoading = true;
  searchInProgress = false;
  activateSendMail = false;
  displayCheckmark: boolean;
  isAllSelected = false;

  enabledFiltersCount = 0;

  sortOptions: Array<SortOption>;

  // Expose l'enum au template
  TabHeaderEnum = TabHeaderEnum;

  bypassMenuClosureOnce = false;
  @ViewChildren(PncCardComponent) pncCards: QueryList<PncCardComponent>;

  constructor(
    private pncService: PncService,
    private pncPhotoService: PncPhotoService,
    private sessionService: SessionService,
    private events: Events,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private mailingService: MailingService,
    private connectivityService: ConnectivityService
  ) {
    if (this.router.url.split('/').includes('filters-opened')) {
      this.isMenuOpened = true;
      this.bypassMenuClosureOnce = true;
    }
    this.initFilters();
    this.initSortOptions();

    this.filtersSubject
      .pipe(switchMap(filters => this.handlePncSearch(filters)))
      .subscribe(pagedPnc => {
        this.handlePncSearchResponse(pagedPnc);
      });

    this.searchMode = this.activatedRoute.snapshot.paramMap.get('mode')
      ? PncSearchModeEnum[this.activatedRoute.snapshot.paramMap.get('mode')]
      : PncSearchModeEnum.FULL
    this.mailingService.mailSendConfirmationEvent.subscribe(() => {
      this.cancelMailSend();
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([this.router.url]);
    });
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
        label: this.translateService.instant(
          'GLOBAL.SORT_LIST.LAST_EOBSERVATION'
        )
      },
      {
        value: 'lastProfessionalInterviewDate',
        label: this.translateService.instant(
          'GLOBAL.SORT_LIST.LAST_PROFESSIONAL_INTERVIEW'
        )
      },
      {
        value: 'lastCareerObjectiveUpdateDate',
        label: this.translateService.instant(
          'GLOBAL.SORT_LIST.LAST_UPDATED_CAREER_OBJECTIVE'
        )
      }
    ]
  }

  /**
   * Affiche la pop d'envoi de mails
   */
  showMailingModal() {
    this.mailingService.openMailingModal(
      this.sessionService.getActiveUser().authenticatedPnc,
      Array.from(this.selectPncRecipients),
      [this.sessionService.getActiveUser().authenticatedPnc]
    );
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
   * Active l'option d'envoi de mails
   */
  enableMailSend() {
    this.activateSendMail = true;
  }

  /**
   * Annule l'option d'envoi de mails
   */
  cancelMailSend() {
    this.activateSendMail = false;
    this.isAllSelected = false;
    this.pncCards.forEach(pncCard => {
      pncCard.displayCheckmark = false;
    })

    this.selectPncRecipients.clear();
  }

  /**
   * Supprime le pnc de la liste des destinataires
   * @param pnc le pnc dont on souhaite retirer des destinataires
   */
  removeRecipient(pnc: PncModel): void {
    this.selectPncRecipients.forEach(pncSelected => {
      if (pncSelected.matricule === pnc.matricule) {
        this.updatePncCheckingState(pnc, false);
        this.selectPncRecipients.delete(pncSelected);
      }
    });
    this.isAllSelected = (this.selectPncRecipients.size === this.totalPncs);
  }

  /**
   * Coche ou décoche le profil d'un pnc
   * @param pnc le pnc dont on souhaite cocher ou décocher
   * @param state indique l'état que l'on souhaite définir
   */
  updatePncCheckingState(pnc: PncModel, state: boolean): void {
    this.pncCards.forEach(pncCard => {
      if (pncCard.pnc.matricule === pnc.matricule) {
        pncCard.displayCheckmark = state;
      }
    });
  }

  /**
   * Ajoute le pnc aux destinataires
   * @param pnc le pnc dont on souhaite ajouter aux destinataires
   */
  addRecipient(pnc: PncModel): void {
    this.selectPncRecipients.add(pnc);
  }


  /**
   * Sélectionne tous les pnc comme destinataires
   * @param checked etat de la checkbox
   */
  selectAllPnc() {
    if (!this.isAllSelected) {
      this.pncService
        .getAllRecipients(this.filters)
        .then((pncs: PncLightModel[]) => {
          this.selectPncRecipients = new Set(
            pncs.map(value => {
              const pncCasted = value as unknown as PncModel;
              return pncCasted;
            }
            )
          );
          this.selectPncRecipients.forEach(value => {
            this.updatePncCheckingState(value, true);
          });
        });
    }

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
    if (this.connectivityService.isConnected()) {
      this.filters.pagePosition = PagePositionEnum.NEXT
      this.filtersSubject.next(this.filters);
    }
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
      if (!this.bypassMenuClosureOnce) {
        this.isMenuOpened = false;
      }
      this.bypassMenuClosureOnce = false;
      return this.getFilteredPncs(filters);
    } else {
      if (this.totalPncs === undefined || this.filters.page < this.totalPncs / AppConstant.PAGE_SIZE) {
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
    return from(
      this.pncService
        .getFilteredPncs(filters)
        .then(pagedPncSearched => {
          return pagedPncSearched;
        })
        .catch(error => {
          return error;
        })
    )
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
      this.pncPhotoService.synchronizePncsPhotos(
        pagedPncs.content.map(pnc => pnc.matricule)
      );
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
   * Détermine la condition d'affichage du bouton d'envoi de mail
   * @returns true si le boutton doit être affiché, faux sinon.
   */
  showMailSendingButton(): boolean {
    return this.isAllSelected ? (this.selectPncRecipients.size === this.totalPncs) : this.selectPncRecipients.size > 0;
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
    return this.connectivityService.isConnected() && this.totalPncs === this.filteredPncs.length;
  }
}
