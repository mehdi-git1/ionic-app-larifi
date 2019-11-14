import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

import { TabHeaderModeEnum } from '../../../core/enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../../core/enums/tab-header.enum';
import { SessionService } from '../../../core/services/session/session.service';
import { TabHeaderService } from '../../../core/services/tab-header/tab-header.service';

@Component({
  selector: 'tab-header',
  templateUrl: 'tab-header.component.html',
  styleUrls: ['./tab-header.component.scss']
})
export class TabHeaderComponent implements OnInit, AfterViewInit {

  @Input() mode: TabHeaderModeEnum = TabHeaderModeEnum.EDOSSIER;

  @Input() activeTab: TabHeaderEnum;

  @ViewChild('tabListRef', { static: false }) tabListRef: ElementRef;

  tabList: Array<any>;

  TabHeaderModeEnum = TabHeaderModeEnum;

  constructor(
    private events: Events,
    private router: Router,
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
      this.tabListRef.nativeElement
        .querySelector(`#${this.activeTab}`).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
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
    if (this.mode === TabHeaderModeEnum.EDOSSIER) {
      if (this.sessionService.visitedPnc) {
        this.router.navigate(['tabs', 'visit', this.sessionService.visitedPnc.matricule, tab.route]);
      } else {
        this.router.navigate([tab.route]);
      }
    } else {
      this.router.navigate([tab.route]);
    }
  }

  /**
   * Teste si l'onglet en paramètre est actif
   * @param tab l'onglet à tester
   * @return vrai s'il s'agit de l'onglet actif, faux sinon
   */
  isActive(tab: any): boolean {
    return this.activeTab === tab.id;
  }

  /**
   * Redirige vers la page d'accueil
   */
  goToHome() {
    if (this.sessionService.getActiveUser().isManager) {
      this.router.navigate(['tabs', 'home']);
    } else {
      this.router.navigate(['development-program']);
    }
  }
}
