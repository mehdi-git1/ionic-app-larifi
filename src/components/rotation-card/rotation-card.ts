import { TranslateService } from '@ngx-translate/core';
import { SynchronizationProvider } from './../../providers/synchronization/synchronization';
import { ToastProvider } from './../../providers/toast/toast';
import { Leg } from './../../models/leg';
import { FlightCrewListPage } from './../../pages/flight-crew-list/flight-crew-list';
import { NavParams, NavController } from 'ionic-angular';
import { RotationProvider } from './../../providers/rotation/rotation';
import { Rotation } from './../../models/rotation';
import { Component, Input } from '@angular/core';
import { ConnectivityService } from '../../services/connectivity.service';
import { LegProvider } from './../../providers/leg/leg';
import { CrewMember } from '../../models/CrewMember';

@Component({
  selector: 'rotation-card',
  templateUrl: 'rotation-card.html'
})
export class RotationCardComponent {

  @Input() rotation: Rotation;
  synchroInProgress: boolean;

  constructor(private rotationProvider: RotationProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public connectivityService: ConnectivityService,
    private legProvider: LegProvider,
    private toastProvider: ToastProvider,
    private synchronizationProvider: SynchronizationProvider,
    private translate: TranslateService) {
  }

  /**
  * Ouvre/ferme une rotation et récupère la liste des tronçons si elle est ouverte
  * @param rotation La rotation à ouvrir/fermer
  */
  toggleRotation(rotation: Rotation) {
    rotation.opened = !rotation.opened;
    if (rotation.opened) {
      rotation.loading = true;
      this.rotationProvider.getRotationLegs(rotation).then(rotationLegs => {
        rotation.legs = rotationLegs;
        rotation.loading = false;
      }, error => {
        rotation.loading = false;
      });
    }
  }

  goToFlightCrewListPage(leg: Leg) {
    this.navCtrl.push(FlightCrewListPage, { leg: leg });
  }

  /**
  * Précharge les eDossier des PNC de la rotation en passant par le lien rotation -> leg -> crewMembers
  */
  downloadRotationPncsEdossier(event: Event, leg: Leg) {
    this.synchroInProgress = true;
    const pncsMatriculeToDownload: string[] = new Array();
    const downloadPromises: Promise<boolean>[] = new Array();
    const matriculePromises: Promise<CrewMember[]>[] = new Array();
    this.rotationProvider.getRotationLegs(this.rotation).then(rotationLegs => {
      for (leg of rotationLegs) {
        matriculePromises.push(this.legProvider.getFlightCrewFromLeg(leg.techId));
      }
      Promise.all(matriculePromises).then(values => {
        for (const flightCrewList of values) {
          for (const flightCrew of flightCrewList) {
            pncsMatriculeToDownload.push(flightCrew.pnc.matricule);
          }
        }

        const uniquePncsMatriculeOnRotation = pncsMatriculeToDownload.filter((el, i, a) => i === a.indexOf(el));

        for (const matricule of uniquePncsMatriculeOnRotation) {
          downloadPromises.push(this.synchronizationProvider.storeEDossierOffline(matricule));
        }

        Promise.all(downloadPromises).then(success => {
          const infoMsg = this.translate.instant('SYNCHRONIZATION.ROTATION_SAVED_OFFLINE', { 'rotationNumber': this.rotation.number });
          this.toastProvider.info(infoMsg);
          this.synchroInProgress = false;
        }, error => {
          this.displayErrorMessage();
        });
      }, error => {
        this.displayErrorMessage();
      });
    }, error => {
      this.displayErrorMessage();
    });
  }

  displayErrorMessage() {
    const errorMsg = this.translate.instant('SYNCHRONIZATION.ROTATION_SAVED_OFFLINE_ERROR', { 'rotationNumber': this.rotation.number });
    this.toastProvider.error(errorMsg);
    this.synchroInProgress = false;
  }
}

