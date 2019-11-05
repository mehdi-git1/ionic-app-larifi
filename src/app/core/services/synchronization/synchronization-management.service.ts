import * as _ from 'lodash';

import { EventEmitter, Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { SynchroStatusEnum } from '../../enums/synchronization/synchro-status.enum';
import { PncModel } from '../../models/pnc.model';
import { SynchroRequestModel } from '../../models/synchro-request.model';
import { ConnectivityService } from '../connectivity/connectivity.service';
import { SynchronizationService } from './synchronization.service';

@Injectable({ providedIn: 'root' })
export class SynchronizationManagementService {
  MAX_CONCURRENT_SYNCHRO_REQUEST = 5;
  concurrentSynchroRequestCount = 0;

  synchroRequestList = new Array<SynchroRequestModel>();

  synchroErrorCountChange = new EventEmitter<number>();
  progressChange = new EventEmitter<number>();
  synchroRequestListChange = new EventEmitter<SynchroRequestModel[]>();

  constructor(
    private synchronizationService: SynchronizationService,
    private connectivityService: ConnectivityService,
    private events: Events) {
    this.events.subscribe('SynchroRequest:add', (pnc) => {
      this.addSynchroRequest(pnc);
    });
  }

  /**
   * Renvoie la liste des demandes de synchro
   * @return la liste des synchros
   */
  public getSynchroRequestList(): SynchroRequestModel[] {
    return this.synchroRequestList;
  }

  /**
   * Ajoute une demande de synchronisation pour un pnc donné
   * @param pnc le pnc à synchroniser
   */
  public addSynchroRequest(pnc: PncModel): void {
    const synchroRequest = new SynchroRequestModel();
    synchroRequest.pnc = pnc;
    synchroRequest.synchroStatus = SynchroStatusEnum.PENDING;

    // On ajoute à la file d'attente la demande de synchro ou on relance la synchro si la demande existe déjà
    const synchroRequestFound = this.synchroRequestList.find((request) => {
      return request.pnc.matricule === pnc.matricule;
    });
    if (synchroRequestFound) {
      this.reinitSynchroRequest(synchroRequestFound);
    } else {
      this.synchroRequestList.push(synchroRequest);
    }

    this.emitProgress();
    this.emitSynchroRequestList();

    this.processSynchroRequestList();
  }

  /**
   * Lance le processus de traitement de la file d'attente des demandes synchro
   */
  public processSynchroRequestList(): void {
    const pendingSynchroRequestList = this.synchroRequestList.filter(synchroRequest => {
      return synchroRequest.synchroStatus === SynchroStatusEnum.PENDING;
    });

    const inProgressSynchroRequestList = this.synchroRequestList.filter(synchroRequest => {
      return synchroRequest.synchroStatus === SynchroStatusEnum.IN_PROGRESS;
    });
    if (this.concurrentSynchroRequestCount < this.MAX_CONCURRENT_SYNCHRO_REQUEST && this.connectivityService.isConnected()) {
      if (pendingSynchroRequestList.length > 0) {
        this.processSynchroRequest(pendingSynchroRequestList[0]);
      } else if (inProgressSynchroRequestList.length === 0) {
        // On ne réinitialise les compteurs que lorsque toutes les demandes ont été traitées
        this.concurrentSynchroRequestCount = 0;

        this.emitErrorCounter();
      }
    }
  }

  /**
   * Reprend le processus de synchronisation de la file d'attente
   * @param retryFailedRequest si on doit retenter les demandes en échec
   */
  public resumeSynchroRequestProcessing(retryFailedRequest = false): void {
    if (retryFailedRequest) {
      this.synchroRequestList.filter(synchroRequest => {
        return synchroRequest.synchroStatus === SynchroStatusEnum.FAILED;
      }).forEach(synchroRequest => {
        this.reinitSynchroRequest(synchroRequest);
      });
    }

    for (let i = 0; i < this.MAX_CONCURRENT_SYNCHRO_REQUEST; i++) {
      this.processSynchroRequestList();
    }
  }

  /**
   * Traite une demande de synchro
   * @param synchroRequest la demande de synchro à traiter
   */
  private processSynchroRequest(synchroRequest: SynchroRequestModel): void {
    synchroRequest.synchroStatus = SynchroStatusEnum.IN_PROGRESS;
    this.concurrentSynchroRequestCount++;
    this.synchronizationService.storeEDossierOffline(synchroRequest.pnc.matricule).then(success => {
      synchroRequest.synchroStatus = SynchroStatusEnum.SUCCESSFUL;
    }, error => {
      synchroRequest.synchroStatus = SynchroStatusEnum.FAILED;
      synchroRequest.errorMessage = error;
    }).then(() => {
      // Finally
      this.concurrentSynchroRequestCount--;
      this.emitProgress();
      this.emitSynchroRequestList();
      this.processSynchroRequestList();
    });
  }

  /**
   * Vide la file d'attente
   */
  public clearSynchroRequestList(): void {
    this.synchroRequestList = new Array();
    this.emitErrorCounter();
    this.emitSynchroRequestList();
  }

  /**
   * Supprime une demande de synchro de la file d'attente
   * @param synchroRequest la demande à supprimer
   */
  public deleteSynchroRequest(synchroRequest: SynchroRequestModel): void {
    _.remove(this.synchroRequestList, (requestItem) => {
      return requestItem.pnc.matricule === synchroRequest.pnc.matricule;
    });
    this.emitErrorCounter();
  }

  /**
   * Remet à l'état d'origine une demande de synchro
   * @param synchroRequest la demande de synchro à réinitialiser
   */
  public reinitSynchroRequest(synchroRequest: SynchroRequestModel): void {
    synchroRequest.synchroStatus = SynchroStatusEnum.PENDING;
    synchroRequest.errorMessage = undefined;
    this.processSynchroRequestList();
  }

  /**
   * Récupère le nombre de synchro en erreur
   * @return le nombre de synchro en erreur
   */
  public getSynchroErrorCount(): number {
    return this.synchroRequestList.filter(synchroRequest => {
      return synchroRequest.synchroStatus === SynchroStatusEnum.FAILED;
    }).length;
  }

  /**
   * Récupère le pourcentage de progression de la file d'attente
   * @return le pourcentage de progression
   */
  public getProgress(): number {
    const processedSynchroRequest = this.synchroRequestList.filter(synchroRequest => {
      return synchroRequest.synchroStatus === SynchroStatusEnum.FAILED || synchroRequest.synchroStatus === SynchroStatusEnum.SUCCESSFUL;
    }).length;
    return Math.round((processedSynchroRequest / this.synchroRequestList.length) * 100);
  }

  /**
   * Transmet le nombre de requêtes en erreur
   */
  private emitErrorCounter(): void {

    this.synchroErrorCountChange.emit(this.getSynchroErrorCount());
  }

  /**
   * Transmet le pourcentage de progression de la file d'attente
   */
  private emitProgress(): void {
    this.progressChange.emit(this.getProgress());
  }

  /**
   * Transmet la liste des demandes de synchro
   */
  private emitSynchroRequestList(): void {
    this.synchroRequestListChange.emit(this.synchroRequestList);
  }

}
