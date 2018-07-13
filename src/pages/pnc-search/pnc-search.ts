import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from './../../services/connectivity.service';
import { CrewMember } from './../../models/crewMember';
import { SessionService } from './../../services/session.service';
import { PncHomePage } from './../pnc-home/pnc-home';
import { GenderProvider } from './../../providers/gender/gender';
import { AppConfig } from './../../app/app.config';
import { PncProvider } from './../../providers/pnc/pnc';
import { TranslateService } from '@ngx-translate/core';
import { Pnc } from './../../models/pnc';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-pnc-search',
  templateUrl: 'pnc-search.html',
})
export class PncSearchPage {

  filteredPncs: Pnc[];

  searchInProgress: boolean;

  totalPncs: number;
  pageSize: number;
  pageSizeOptions: number[];
  itemOffset: number;

  constructor(
    public translate: TranslateService,
    private pncProvider: PncProvider,
    private genderProvider: GenderProvider,
    private sessionService: SessionService,
    private connectivityService: ConnectivityService,
    private toastProvider: ToastProvider) {

    // initialistation du filtre
    this.initFilter();
  }

  ionViewDidLoad() {
    this.totalPncs = 0;
    this.pageSize = AppConfig.pageSize;
  }

  /**
   * Initialise le filtre, le nombre de pnc à afficher par page et les données des listes de recherche.
   */
  initFilter() {
    this.pageSize = AppConfig.pageSize;
    this.itemOffset = 0;
  }

  /**
   * recupere 10 pnc correspondant aux criteres saisis du filtre.
   */
  searchPncs() {
    this.searchInProgress = true;
    this.pncProvider.getFilteredPncs().then(pagedPnc => {
      this.searchInProgress = false;
      this.filteredPncs = pagedPnc.content;
      this.totalPncs = pagedPnc.page.totalElements;
    }).catch((err) => {
      this.searchInProgress = false;
      this.toastProvider.error(this.translate.instant('PNC_SEARCH.ERROR.SEARCH'));
    }
    );
  }

  createCrewMemberObjectFromPnc(pnc: Pnc) {
    const crewMember: CrewMember = new CrewMember();
    crewMember.pnc = pnc;
    return crewMember;
  }

}
