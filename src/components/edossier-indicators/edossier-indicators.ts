import { DeviceService } from './../../services/device.service';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ConnectivityService } from './../../services/connectivity.service';
import { NavController, NavParams } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { SettingsPage } from '../../pages/settings/settings';

@Component({
  selector: 'edossier-indicators',
  templateUrl: 'edossier-indicators.html'
})
export class NavBarCustomComponent {

  // On affiche par defaut les settings
  @Input() showSettingsIcon = true;
  @Input() showSynchronisationIcon = true;

  connected: boolean;
  synchroInProgress: boolean;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    public connectivityService: ConnectivityService,
<<<<<<< HEAD
    public synchronizationProvider: SynchronizationProvider,
    private deviceService: DeviceService) {
=======
    public deviceService: DeviceService,
    public synchronizationProvider: SynchronizationProvider) {
>>>>>>> origin/release/sprint7
    this.connected = this.connectivityService.isConnected();

    this.connectivityService.connectionStatusChange.subscribe(connected => {
      this.connected = connected;
    });

    this.synchronizationProvider.synchroStatusChange.subscribe(synchroInProgress => {
      this.synchroInProgress = synchroInProgress;
    });
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
