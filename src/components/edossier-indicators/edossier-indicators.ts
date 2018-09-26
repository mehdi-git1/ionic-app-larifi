import { DeviceService } from './../../services/device.service';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ConnectivityService } from './../../services/connectivity.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SettingsPage } from '../../pages/settings/settings';

@Component({
  selector: 'edossier-indicators',
  templateUrl: 'edossier-indicators.html'
})
export class NavBarCustomComponent {

  // On affiche par defaut les settings
  @Input() showSettingsIcon = true;
  @Input() showRefreshIcon = false;

  @Output() refreshPage = new EventEmitter();

  connected: boolean;
  synchroInProgress: boolean;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    public connectivityService: ConnectivityService,
    public deviceService: DeviceService,
    public synchronizationProvider: SynchronizationProvider) {
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
    this.navCtrl.push(SettingsPage);
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

}
