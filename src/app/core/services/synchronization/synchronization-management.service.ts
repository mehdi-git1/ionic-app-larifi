import { SynchronizationService } from './synchronization.service';
import { PncModel } from './../../models/pnc.model';
import { SynchroRequestModel } from './../../models/synchro-request.model';
import { Injectable } from '@angular/core';
import { SynchroStatusEnum } from '../../enums/synchronization/synchro-status.enum';
import { Events } from 'ionic-angular';
import * as _ from 'lodash';
import { ConnectivityService } from '../connectivity/connectivity.service';

@Injectable()
export class SynchronizationManagementService {
  MAX_CONCURRENT_SYNCHRO_REQUEST = 5;
  concurrentSynchroRequestCount = 0;
  processedSynchroRequest = 0;

  synchroRequestList = new Array<SynchroRequestModel>();


  constructor(private synchronizationService: SynchronizationService,
    private connectivityService: ConnectivityService,
    private events: Events) {
    this.events.subscribe('SynchroRequest:add', (pnc) => {
      this.addSynchroRequest(pnc);
    });
  }

  public getSynchroRequestList(): SynchroRequestModel[] {
    return this.synchroRequestList;
  }

  public addSynchroRequest(pnc: PncModel): void {
    const synchroRequest = new SynchroRequestModel();
    synchroRequest.pnc = pnc;
    synchroRequest.synchroStatus = SynchroStatusEnum.PENDING;

    // On réinitialise le compteur pour avoir un pourcentage cohérent
    this.processedSynchroRequest = 0;

    // On ajoute à la file d'attente la demande de synchro ou on relance la synchro si la demande existe déjà
    const synchroRequestFound = this.synchroRequestList.find((request) => {
      return request.pnc.matricule === pnc.matricule;
    });
    if (synchroRequestFound) {
      this.reinitSynchroRequest(synchroRequestFound);
    } else {
      this.synchroRequestList.push(synchroRequest);
    }

    this.processSynchroRequestList();
  }

  public processSynchroRequestList(): void {
    const pendingSynchroRequestList = this.synchroRequestList.filter(synchroRequest => {
      return synchroRequest.synchroStatus === SynchroStatusEnum.PENDING;
    });
    if (this.concurrentSynchroRequestCount < this.MAX_CONCURRENT_SYNCHRO_REQUEST && this.connectivityService.isConnected()) {
      if (pendingSynchroRequestList.length > 0) {
        this.processSynchroRequest(pendingSynchroRequestList[0]);
      } else {
        this.processedSynchroRequest = 0;
        this.concurrentSynchroRequestCount = 0;
      }
    }
  }

  private processSynchroRequest(synchroRequest: SynchroRequestModel): void {
    synchroRequest.synchroStatus = SynchroStatusEnum.IN_PROGRESS;
    this.concurrentSynchroRequestCount++;
    this.updateProgress();
    this.synchronizationService.storeEDossierOffline(synchroRequest.pnc.matricule, false).then(success => {
      synchroRequest.synchroStatus = SynchroStatusEnum.SUCCESSFUL;
    }, error => {
      synchroRequest.synchroStatus = SynchroStatusEnum.FAILED;
      synchroRequest.errorMessage = error;
    }).then(() => {
      // Finally
      this.concurrentSynchroRequestCount--;
      this.processSynchroRequestList();
    });
  }

  private updateProgress(): void {
    this.processedSynchroRequest++;
  }

  public getProgress(): number {
    return Math.round((this.processedSynchroRequest / this.synchroRequestList.length) * 100);
  }

  public clearSynchroRequestList(): SynchroRequestModel[] {
    return this.synchroRequestList = new Array();
  }

  public deleteSynchroRequest(synchroRequest: SynchroRequestModel): void {
    _.remove(this.synchroRequestList, (requestItem) => {
      return requestItem.pnc.matricule === synchroRequest.pnc.matricule;
    });
  }

  public reinitSynchroRequest(synchroRequest: SynchroRequestModel): void {
    synchroRequest.synchroStatus = SynchroStatusEnum.PENDING;
    synchroRequest.errorMessage = undefined;
    this.processSynchroRequestList();
  }

}
