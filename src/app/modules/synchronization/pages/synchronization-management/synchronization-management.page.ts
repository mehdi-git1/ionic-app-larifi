import { Component } from '@angular/core';

import {
    SynchroRequestTypeEnum
} from '../../../../core/enums/synchronization/synchro-request-type.enum';
import { ConnectivityService } from '../../../../core/services/connectivity/connectivity.service';

@Component({
    selector: 'synchronization-management',
    templateUrl: 'synchronization-management.page.html',
    styleUrls: ['./synchronization-management.page.scss']
})
export class SynchronizationManagementPage {

    SynchroRequestTypeEnum = SynchroRequestTypeEnum;

    synchronizationType: SynchroRequestTypeEnum;

    constructor(
        private connectivityService: ConnectivityService) {
        this.synchronizationType = SynchroRequestTypeEnum.FETCH;
    }

    /**
     * Change de mode d'affichage
     * @param selectedDisplayMode le mode d'affichage sélectionné
     */
    changeTab(selectedDisplayMode: SynchroRequestTypeEnum): void {
        this.synchronizationType = selectedDisplayMode;
    }

    /**
     * Vérifie si un onglet est actif
     * @param mode le mode (onglet) à tester
     * @return vrai si le mode est actif, faux sinon
     */
    isTabActive(mode: SynchroRequestTypeEnum): boolean {
        return mode === this.synchronizationType;
    }

    /**
     * Teste si on est mode déconnecté ou non
     * @return vrai si l'appli est connecté, faux sinon
     */
    isConnected(): boolean {
        return this.connectivityService.isConnected();
    }
}

