import { OfflineIndicatorComponent } from './../offline-indicator/offline-indicator';
import { Component, Input, ViewChild } from '@angular/core';
import { Leg } from './../../models/leg';
import { FlightCrewListPage } from './../../pages/flight-crew-list/flight-crew-list';
import { RotationProvider } from './../../providers/rotation/rotation';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { ConnectivityService } from '../../services/connectivity.service';
import { TranslateService } from '@ngx-translate/core';
import { LegProvider } from './../../providers/leg/leg';

@Component({
  selector: 'flight-card',
  templateUrl: 'flight-card.html'
})
export class FlightCardComponent {

  @Input() leg: Leg;
  synchroInProgress: boolean;

  @ViewChild(OfflineIndicatorComponent)
  private offlineIndicatorComponent: OfflineIndicatorComponent;

  constructor(public connectivityService: ConnectivityService,
    private synchronizationProvider: SynchronizationProvider,
    private toastProvider: ToastProvider,
    private legProvider: LegProvider,
    private translate: TranslateService) {
  }

  /**
  * Précharge les eDossier des PNC du vol
  */
  downloadAllFlightPncsEdossier(leg: Leg) {
    event.stopPropagation();
    this.synchroInProgress = true;

    this.legProvider.getFlightCrewFromLeg(leg.techId).then(flightCrewList => {
      const promises: Promise<boolean>[] = new Array();
      for (const flightCrew of flightCrewList) {
        const currentMatricule = flightCrew.pnc.matricule;
        promises.push(this.synchronizationProvider.storeEDossierOffline(currentMatricule));
      }
      Promise.all(promises).then(success => {
        const infoMsg = this.translate.instant('SYNCHRONIZATION.FLIGHT_SAVED_OFFLINE', { 'flightNumber': leg.company + leg.number });
        this.toastProvider.info(infoMsg);
        this.synchroInProgress = false;
        this.offlineIndicatorComponent.refreshOffLineDateOnCurrentObject();
      }, error => {
        const errorMsg = this.translate.instant('SYNCHRONIZATION.FLIGHT_SAVED_OFFLINE_ERROR', { 'flightNumber': leg.company + leg.number });
        this.toastProvider.error(errorMsg);
        this.synchroInProgress = false;
      });
    }, error => {
      const errorMsg = this.translate.instant('SYNCHRONIZATION.FLIGHT_SERVICE_CALL_ERROR', { 'flightNumber': leg.company + leg.number });
      this.toastProvider.error(errorMsg);
      this.synchroInProgress = false;
    });
  }
}
