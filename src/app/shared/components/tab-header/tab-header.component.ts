import { CareerObjectiveListPage } from './../../../modules/development-program/pages/career-objective-list/career-objective-list.page';
import { TabHeaderModeEnum } from '../../../core/enums/tab-header-mode.enum';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { PncHomePage } from '../../../modules/home/pages/pnc-home/pnc-home.page';
import { SessionService } from '../../../core/services/session/session.service';
import { TabHeaderService } from '../../../core/services/tab-header/tab-header.service';
import { TabHeaderEnum } from '../../../core/enums/tab-header.enum';

@Component({
  selector: 'tab-header',
  templateUrl: 'tab-header.component.html'
})
export class TabHeaderComponent implements OnInit, AfterViewInit {

  @Input() mode: TabHeaderModeEnum = TabHeaderModeEnum.EDOSSIER;

  @Input() activeTab: TabHeaderEnum;

  @ViewChild('tabListRef') tabListRef: ElementRef;

  tabList: Array<any>;

  TabHeaderModeEnum = TabHeaderModeEnum;

  constructor(
    private events: Events,
    private navCtrl: NavController,
    private tabHeaderService: TabHeaderService,
    private sessionService: SessionService
  ) {
    this.events.subscribe('user:authenticationDone', () => {
      this.initTabNav();
    });
  }

  ngOnInit() {
    this.initTabNav();
  }

  ngAfterViewInit() {
    if (this.tabListRef && this.tabListRef.nativeElement.querySelector(`#${this.activeTab}`)) {
      this.tabListRef.nativeElement.querySelector(`#${this.activeTab}`).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    }
  }

  /**
   * Initialise les onglets
   */
  initTabNav() {
    this.tabList = this.tabHeaderService.getTabList(this.mode);
  }

  /**
   * Ouvre l'onglet indiqué en paramètre
   * @param tab l'onglet vers lequel naviguer
   */
  openTab(tab: any) {
    let navParams = {};
    if (this.mode === TabHeaderModeEnum.EDOSSIER && this.sessionService.visitedPnc && !this.sessionService.isActiveUser(this.sessionService.visitedPnc)) {
      navParams = { matricule: this.sessionService.visitedPnc.matricule };
    }
    this.navCtrl.setRoot(tab.component, navParams);
  }

  /**
   * Teste si l'onglet en paramètre est actif
   * @param tab l'onglet à tester
   * @return vrai s'il s'agit de l'onglet actif, faux sinon
   */
  isActive(tab: any): boolean {
    return this.activeTab == tab.id;
  }

  /**
   * Retour à la page d'accueil
   */
  goToHome() {
    this.navCtrl.setRoot(this.sessionService.getActiveUser().isManager ? PncHomePage : CareerObjectiveListPage);
  }
}
