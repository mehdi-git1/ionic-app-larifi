import { SynchronizationService } from './synchronization.service';
import { PncModel } from './../../models/pnc.model';
import { SynchroRequestModel } from './../../models/synchro-request.model';
import { Injectable, EventEmitter } from '@angular/core';
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

  synchroErrorCount = 0;

  constructor(private synchronizationService: SynchronizationService,
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
        this.processedSynchroRequest = 0;
        this.concurrentSynchroRequestCount = 0;

        this.updateErrorCounter();
      }
    }
  }

  /**
   * Traite une demande de synchro
   * @param synchroRequest la demande de synchro à traiter
   */
  private processSynchroRequest(synchroRequest: SynchroRequestModel): void {
    synchroRequest.synchroStatus = SynchroStatusEnum.IN_PROGRESS;
    this.concurrentSynchroRequestCount++;
    this.synchronizationService.storeEDossierOffline(synchroRequest.pnc.matricule, false).then(success => {
      synchroRequest.synchroStatus = SynchroStatusEnum.SUCCESSFUL;
    }, error => {
      synchroRequest.synchroStatus = SynchroStatusEnum.FAILED;
      synchroRequest.errorMessage = error;
      this.updateErrorCounter();
    }).then(() => {
      // Finally
      this.processedSynchroRequest++;
      this.concurrentSynchroRequestCount--;
      this.processSynchroRequestList();
    });
  }

  /**
   * Récupère le pourcentage de progression de la file d'attente
   * @return le pourcentage de progression
   */
  public getProgress(): number {
    return Math.round((this.processedSynchroRequest / this.synchroRequestList.length) * 100);
  }

  /**
   * Vide la file d'attente
   */
  public clearSynchroRequestList(): void {
    this.synchroRequestList = new Array();
    this.updateErrorCounter();
  }

  /**
   * Supprime une demande de synchro de la file d'attente
   * @param synchroRequest la demande à supprimer
   */
  public deleteSynchroRequest(synchroRequest: SynchroRequestModel): void {
    _.remove(this.synchroRequestList, (requestItem) => {
      return requestItem.pnc.matricule === synchroRequest.pnc.matricule;
    });
    this.updateErrorCounter();
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
   * Met à jour le compteur de requêtes en erreur
   */
  private updateErrorCounter() {
    this.synchroErrorCount = this.synchroRequestList.filter(synchroRequest => {
      return synchroRequest.synchroStatus === SynchroStatusEnum.FAILED;
    }).length;
  }

  /**
   * Récupère le nombre de synchro en erreur
   * @return le nombre de synchro en erreur
   */
  public getSynchroErrorCount(): number {
    return this.synchroErrorCount;
  }
}
