import { TranslateService } from '@ngx-translate/core';
import { PriorityDropdownListComponent } from './../priority-dropdown-list/priority-dropdown-list.component';
import { Events, PopoverController } from 'ionic-angular';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AppConstant } from '../../../../app.constant';
import { SpecialityEnum } from '../../../../core/enums/speciality.enum';
import { DivisionModel } from '../../../../core/models/division.model';
import { GinqModel } from '../../../../core/models/ginq.model';
import { PncFilterModel } from '../../../../core/models/pnc-filter.model';
import { PncModel } from '../../../../core/models/pnc.model';
import { SectorModel } from '../../../../core/models/sector.model';
import { RelayModel } from '../../../../core/models/statutory-certificate/relay.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import { SessionService } from '../../../../core/services/session/session.service';

@Component({
  selector: 'pnc-search-filter',
  templateUrl: 'pnc-search-filter.component.html'
})
export class PncSearchFilterComponent implements OnInit {
  private static CDK_OVERLAY_0 = '#cdk-overlay-0';
  private static MAT_AUTOCOMPLETE_0 = '#mat-autocomplete-0';

  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  @Output() pncSelected: EventEmitter<any> = new EventEmitter();

  defaultDivision: string;
  defaultSector: string;
  defaultGinq: string;
  defaultValue: boolean;
  valueAll = AppConstant.ALL;
  prioritized: boolean;
  priority: boolean;
  noPriority: boolean;

  searchForm: FormGroup;

  // filtre de recherche
  pncFilter: PncFilterModel;
  // afficher/masquer le filtre
  showFilter = false;

  // Les listes des données du filtre
  divisionList: Array<DivisionModel>;
  sectorList: Array<SectorModel>;
  ginqList: Array<GinqModel>;
  relayList: Array<RelayModel>;
  aircraftSkillList: string[];
  specialityList: string[];

  outOfDivision: boolean;
  priorityFilter;

  constructor(
    private sessionService: SessionService,
    private formBuilder: FormBuilder,
    private connectivityService: ConnectivityService,
    private events: Events,
    public popoverCtrl: PopoverController,
    public translateService: TranslateService
  ) {
    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.initFilter();
    });

    this.events.subscribe('user:authenticationDone', () => {
      this.initFilter();
      this.initForm();
    });

  }

  /**
   * Ouvre la popover de choix de priorités
   * @param myEvent  event
   * @param eObservationItem item
   */
  openPriorityDropdownList(myEvent: Event) {
    const popover = this.popoverCtrl.create(PriorityDropdownListComponent, { prioritized: this.prioritized, priority: this.priority, noPriority: this.noPriority}, { cssClass: 'priority-dropdown-list-popover' });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data) {
        this.prioritized = data.prioritized;
        this.priority = data.priority;
        this.noPriority = data.noPriority;
        this.searchForm.get('hasAtLeastOnePriorityInProgressControl').setValue(data.priority);
        this.searchForm.get('hasNoPriorityControl').setValue(data.noPriority);
        this.searchForm.get('prioritizedControl').setValue(data.prioritized);
        this.search();
      }
    });
  }

  /**
   * Action déclenchée lors du click
   * @param evt event : click
   */
  search(): void {
    this.onSearch.next();
  }

  ngOnInit() {
    // initialistation du filtre
    this.initFilter();
    // Initialisation du formulaire
    this.initForm();
  }

  getFormattedPriorityFilter(): string {
    let filterValues = '';
    if (this.prioritized) {
      filterValues += ' ' + this.translateService.instant('PNC_SEARCH.CRITERIA.PRIORITIZED_SHORT') + ',';
    }
    if (this.priority) {
      filterValues += ' ' + this.translateService.instant('PNC_SEARCH.CRITERIA.PRIORITY_IN_PROGRESS_SHORT') + ',';
    }
    if (this.noPriority) {
      filterValues += ' ' + this.translateService.instant('PNC_SEARCH.CRITERIA.NO_PRIORITY_SHORT') + ',';
    }
    if (filterValues.length > 0 && filterValues.charAt(filterValues.length - 1) === ',') {
      filterValues = filterValues.substr(0, filterValues.length - 1);
    }
    return filterValues;
  }

  /**
   * Initialise le filtre, le nombre de pnc à afficher par page et les données des listes de recherche.
   */
  initFilter() {
    this.pncFilter = new PncFilterModel();
    this.showFilter = true;
    this.specialityList = Object.keys(SpecialityEnum)
      .map(k => SpecialityEnum[k])
      .filter(v => typeof v === 'string') as string[];
    if (this.sessionService.getActiveUser().appInitData !== undefined) {
      const appInitData = this.sessionService.getActiveUser().appInitData;
      this.divisionList = appInitData.divisionSectorGinqTree;
      if (this.divisionList.length === 0) {
        this.outOfDivision = true;
      } else {
        this.outOfDivision = false;
        // tslint:disable-next-line: no-misleading-array-reverse
        this.relayList = appInitData.relays.sort((relay1, relay2) => {
          return relay1.code > relay2.code ? 1 : -1;
        });
        this.aircraftSkillList = appInitData.aircraftSkills;
      }
      this.defaultDivision = appInitData.defaultDivision;
      this.defaultSector = appInitData.defaultSector;
      this.defaultGinq = appInitData.defaultGinq;
    }

  }

  /**
   * Réinitialise les valeurs des filtres de recherche
   */
  resetFilterValues() {
    this.defaultValue = true;
    this.pncFilter.division = this.defaultDivision ? this.defaultDivision : AppConstant.ALL;
    this.divisionOnchanges();
    this.pncFilter.sector = this.defaultSector ? this.defaultSector : AppConstant.ALL;
    this.sectorOnchanges();
    this.pncFilter.ginq = this.defaultGinq ? this.defaultGinq : AppConstant.ALL;
    this.pncFilter.speciality = this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL;
    this.pncFilter.aircraftSkill = this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL;
    this.pncFilter.relay = this.relayList && this.relayList.length === 1 ? this.relayList[0].code : AppConstant.ALL;
    this.pncFilter.prioritized = false;
    this.pncFilter.hasAtLeastOnePriorityInProgress = false;
    this.pncFilter.hasNoPriority = false;
    this.searchForm.get('divisionControl').setValue(this.defaultDivision);
    this.searchForm.get('specialityControl').setValue(this.specialityList && this.specialityList.length === 1 ? this.specialityList[0] : AppConstant.ALL);
    this.searchForm.get('aircraftSkillControl').setValue(this.aircraftSkillList && this.aircraftSkillList.length === 1 ? this.aircraftSkillList[0] : AppConstant.ALL);
    this.searchForm.get('relayControl').setValue(this.relayList && this.relayList.length === 1 ? this.relayList[0] : AppConstant.ALL);
    this.searchForm.get('prioritizedControl').setValue(false);
    this.searchForm.get('hasAtLeastOnePriorityInProgressControl').setValue(false);
    this.searchForm.get('hasNoPriorityControl').setValue(false);
    this.searchForm.get('priorityControl').setValue(new Array());
    this.search();
    this.defaultValue = false;
    this.priority = false;
    this.noPriority = false;
    this.prioritized = false;
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.searchForm = this.formBuilder.group({
      divisionControl: [this.pncFilter.division ? this.pncFilter.division : AppConstant.ALL],
      sectorControl: [this.pncFilter.sector ? this.pncFilter.sector : AppConstant.ALL],
      ginqControl: [this.pncFilter.ginq ? this.pncFilter.ginq : AppConstant.ALL],
      specialityControl: [this.pncFilter.speciality ? this.pncFilter.speciality : AppConstant.ALL],
      aircraftSkillControl: [this.pncFilter.aircraftSkill ? this.pncFilter.aircraftSkill : AppConstant.ALL],
      relayControl: [this.pncFilter.relay ? this.pncFilter.relay : AppConstant.ALL],
      priorityControl: [new Array()],
      prioritizedControl: [false],
      hasAtLeastOnePriorityInProgressControl: [false],
      hasNoPriorityControl: [false]
    });
    if (this.connectivityService.isConnected()) {
      this.resetFilterValues();
      this.formOnChanges();
    }
  }

  /**
   *  deux valeurs et renvois true si elles sont égales
   * @param e1 premiere valeur à comparér
   * @param e2 Deuxieme valeur à comparér
   */
  compareFn(e1: string, e2: string): boolean {
    if (e1 === e2) {
      return true;
    }
    return false;
  }

  /**
   * Fonction permettant de détecter et de gérer les changements de valeur des différents éléments du formulaire
   */
  formOnChanges() {
    this.searchForm.valueChanges.debounceTime(500).subscribe(val => {
      this.pncFilter.ginq = val.ginqControl;
      this.pncFilter.speciality = val.specialityControl;
      this.pncFilter.aircraftSkill = val.aircraftSkillControl;
      this.pncFilter.relay = val.relayControl;
      if (val.priorityControl && val.priorityControl instanceof Array) {
        console.log(val.priorityControl);
        this.pncFilter.prioritized = (val.priorityControl as Array<string>).filter(priorityFilterItem => {
          return priorityFilterItem === 'PRIORITIZED';
        }).length > 0;
        this.pncFilter.hasAtLeastOnePriorityInProgress = (val.priorityControl as Array<string>).filter(priorityFilterItem => {
          return priorityFilterItem === 'PRIORITY_IN_PROGRESS';
        }).length > 0;
        this.pncFilter.hasNoPriority = (val.priorityControl as Array<string>).filter(priorityFilterItem => {
          return priorityFilterItem === 'NO_PRIORITY';
        }).length > 0;
      } else {
        this.pncFilter.prioritized = val.prioritizedControl;
        this.pncFilter.hasAtLeastOnePriorityInProgress = val.hasAtLeastOnePriorityInProgressControl;
        this.pncFilter.hasNoPriority = val.hasNoPriorityControl;
      }

      this.search();
    });
  }

  onPriorityFilterChange(event) {
    console.log(event);
  }

  /**
   * Active le rechargement des secteurs à chaque modification de division
   */
  divisionOnchanges() {
    this.searchForm.get('divisionControl').valueChanges.subscribe(val => {
      if (!this.defaultValue) {
        this.pncFilter.division = val;
      }
      this.getSectorList(this.pncFilter.division);
    });
  }

  /**
   * Active le rechargement des ginqs à chaque modification de secteur
   */
  sectorOnchanges() {
    this.searchForm.get('sectorControl').valueChanges.subscribe(val => {
      if (!this.defaultValue) {
        this.pncFilter.sector = val;
      }
      this.getGinqList(this.pncFilter.sector);
    });
  }

  /**
   * Charge la liste des secteurs associée à la division choisie
   * @param division la division choisie
   */
  getSectorList(division: string) {
    this.ginqList = null;
    this.sectorList = null;
    if (division !== AppConstant.ALL) {
      this.sectorList = this.divisionList.find(divisionItem => divisionItem.code === division).sectors;
    }
    if (this.defaultValue && this.sectorList && this.defaultSector && this.sectorList.find((sector) => sector.code === this.defaultSector)) {
      this.pncFilter.sector = this.defaultSector;
      this.searchForm.get('sectorControl').setValue(this.defaultSector);
    } else {
      this.pncFilter.sector = AppConstant.ALL;
      this.searchForm.get('sectorControl').setValue(AppConstant.ALL);
    }
  }

  /**
   * Charge la liste des ginq associée au secteur choisi
   * @param sector le secteur choisi
   */
  getGinqList(sector: string) {
    this.ginqList = null;
    if (this.pncFilter.division !== AppConstant.ALL && sector !== '' && sector !== AppConstant.ALL) {
      this.ginqList = this.divisionList.find(divisionItem => divisionItem.code === this.pncFilter.division)
        .sectors
        .find(sectorItem => sectorItem.code === sector)
        .ginqs;
    }
    if (this.defaultValue && this.ginqList && this.defaultGinq && this.ginqList.find((ginq) => ginq.code === this.defaultGinq)) {
      this.pncFilter.ginq = this.defaultGinq;
      this.searchForm.get('ginqControl').setValue(this.defaultGinq);
    } else {
      this.pncFilter.ginq = AppConstant.ALL;
      this.searchForm.get('ginqControl').setValue(AppConstant.ALL);
    }
  }

  /**
   * Redirige vers la page d'accueil du pnc ou du cadre
   * @param pnc le pnc concerné
   */
  openPncHomePage(pnc: PncModel) {
    this.pncSelected.emit(pnc);
  }

  /**
  * Ouvre/ferme le filtre
  */
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  areFiltersDisabled(): boolean {
    return !this.connectivityService.isConnected();
  }

  clearButtonIsDisabled(): boolean {
    return this.outOfDivision || this.areFiltersDisabled();
  }

  inactiveFiltersLabelClass(): string {
    return this.connectivityService.isConnected() ? 'hide-label' : 'show-label';
  }
}
