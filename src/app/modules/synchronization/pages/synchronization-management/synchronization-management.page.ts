import { Component } from '@angular/core';
import { SynchronizationManagementService } from '../../../../core/services/synchronization/synchronization-management.service';
import { SynchroRequestModel } from '../../../../core/models/synchro-request.model';
import { SynchroStatusEnum } from '../../../../core/enums/synchronization/synchro-status.enum';
import { SynchroRequestDisplayModeEnum } from '../../../../core/enums/synchronization/synchro-request-display-mode.enum';

@Component({
    selector: 'synchronization-management',
    templateUrl: 'synchronization-management.page.html',
})
export class SynchronizationManagementPage {

    SynchroStatusEnum = SynchroStatusEnum;
    SynchroRequestDisplayModeEnum = SynchroRequestDisplayModeEnum;

    selectedDisplayMode: SynchroRequestDisplayModeEnum;

    synchroRequestList: SynchroRequestModel[];

    constructor(private synchronizationManagementService: SynchronizationManagementService) {
        this.selectedDisplayMode = SynchroRequestDisplayModeEnum.ALL;
    }

    ionViewDidEnter() {
        this.synchroRequestList = this.synchronizationManagementService.getSynchroRequestList();
    }

    clearSynchroRequestList(): void {
        this.synchronizationManagementService.clearSynchroRequestList();
        this.synchroRequestList = this.synchronizationManagementService.getSynchroRequestList();
    }

    getSynchroRequestList(synchroStatus: SynchroStatusEnum): SynchroRequestModel[] {
        if (this.synchroRequestList) {
            return this.synchroRequestList.filter(synchroRequest => {
                return synchroRequest.synchroStatus === synchroStatus;
            });
        }

        return undefined;
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
}

