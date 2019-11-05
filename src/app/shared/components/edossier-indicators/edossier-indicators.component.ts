import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { ConnectivityService } from '../../../core/services/connectivity/connectivity.service';
import { DeviceService } from '../../../core/services/device/device.service';
import { SecurityService } from '../../../core/services/security/security.service';
import { SessionService } from '../../../core/services/session/session.service';
import {
    SynchronizationService
} from '../../../core/services/synchronization/synchronization.service';

@Component({
  selector: 'edossier-indicators',
  templateUrl: 'edossier-indicators.component.html',
  styleUrls: ['./edossier-indicators.component.scss']
})
export class NavBarCustomComponent {

  // On affiche par defaut les settings
  @Input() showSettingsIcon = true;
  @Input() showRefreshIcon = false;

  @Output() refreshPage = new EventEmitter();

  connected: boolean;
  synchroInProgress: boolean;

  constructor(
    private router: Router,
    public connectivityService: ConnectivityService,
    public deviceService: DeviceService,
    public synchronizationProvider: SynchronizationService,
    private securityProvider: SecurityService,
    private sessionService: SessionService) {
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      this.synchroInProgress = synchroInProgress;
    });

  }

  /**
   * envoie un evenement pour recharger la page courante.
   */
  refresh() {
    this.refreshPage.emit();
  }

  /**
   * Dirige vers la page de paramètrage
   */
  goToSettingsPage() {
    this.router.navigate(['settings']);
  }

  /**
   * bascule mode deconnecté/connecté
   */
  connectionToggle() {
    this.connectivityService.isConnected() ? this.connectivityService.setConnected(false) : this.connectivityService.setConnected(true);
  }

  /**
   * Force la synchronisation des données offline
   */
  forceSynchronizeOfflineData() {
    this.synchronizationProvider.synchronizeOfflineData();
  }

  /**
   * Vérifie si on peut afficher la roue dentée
   */
  isAvailable() {
    return this.securityProvider.isAdmin(this.sessionService.authenticatedUser) || !this.deviceService.isBrowser();
  }

}
