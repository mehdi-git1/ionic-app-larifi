import { Component } from '@angular/core';

import {
    SynchroRequestDisplayModeEnum
} from '../../../../core/enums/synchronization/synchro-request-display-mode.enum';
import { SynchroStatusEnum } from '../../../../core/enums/synchronization/synchro-status.enum';
import { SynchroRequestModel } from '../../../../core/models/synchro-request.model';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';
import {
    SynchronizationManagementService
} from '../../../../core/services/synchronization/synchronization-management.service';

@Component({
    selector: 'synchronization-management',
    templateUrl: 'synchronization-management.page.html',
    styleUrls: ['./synchronization-management.page.scss']
})
export class SynchronizationManagementPage {

    SynchroStatusEnum = SynchroStatusEnum;
    SynchroRequestDisplayModeEnum = SynchroRequestDisplayModeEnum;

    selectedDisplayMode: SynchroRequestDisplayModeEnum;

    synchroRequestList: SynchroRequestModel[];

    constructor(
        private synchronizationManagementService: SynchronizationManagementService,
        private connectivityService: ConnectivityService) {
        this.selectedDisplayMode = SynchroRequestDisplayModeEnum.PENDING;

        this.synchronizationManagementService.synchroRequestListChange.subscribe(synchroRequestList => {
            this.synchroRequestList = synchroRequestList;
        });
    }

    ionViewDidEnter() {
        this.synchroRequestList = this.synchronizationManagementService.getSynchroRequestList();
    }

    clearSynchroRequestList(): void {
        this.synchronizationManagementService.clearSynchroRequestList();
    }

    /**
     * Récupère la liste des demandes de synchro en fonction du mode d'affichage demandé
     * @return la liste des demandes correspondant au mode d'affichage
     */
    getSynchroRequestList(synchroRequestDisplayModeEnum: SynchroRequestDisplayModeEnum): SynchroRequestModel[] {
        if (this.synchroRequestList) {
            if (synchroRequestDisplayModeEnum === SynchroRequestDisplayModeEnum.PENDING) {
                return this.synchroRequestList.filter(synchroRequest => {
                    return synchroRequest.synchroStatus === SynchroStatusEnum.PENDING
                        || synchroRequest.synchroStatus === SynchroStatusEnum.IN_PROGRESS;
                });
            }

            if (synchroRequestDisplayModeEnum === SynchroRequestDisplayModeEnum.SUCCESSFUL) {
                return this.synchroRequestList.filter(synchroRequest => {
                    return synchroRequest.synchroStatus === SynchroStatusEnum.SUCCESSFUL;
                });
            }

            if (synchroRequestDisplayModeEnum === SynchroRequestDisplayModeEnum.FAILED) {
                return this.synchroRequestList.filter(synchroRequest => {
                    return synchroRequest.synchroStatus === SynchroStatusEnum.FAILED;
                });
            }
        }

        return this.synchroRequestList;
    }

    /**
     * Change de mode d'affichage
     * @param selectedDisplayMode le mode d'affichage sélectionné
     */
    changeTab(selectedDisplayMode: SynchroRequestDisplayModeEnum): void {
        this.selectedDisplayMode = selectedDisplayMode;
    }

    /**
     * Vérifie si un onglet est actif
     * @param mode le mode (onglet) à tester
     * @return vrai si le mode est actif, faux sinon
     */
    isTabActive(mode: SynchroRequestDisplayModeEnum): boolean {
        return mode === this.selectedDisplayMode;
    }

    /**
     * Teste si on est mode déconnecté ou non
     * @return vrai si l'appli est connecté, faux sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }
}

