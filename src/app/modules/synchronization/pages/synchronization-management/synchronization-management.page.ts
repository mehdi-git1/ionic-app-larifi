import { Component } from '@angular/core';
import { SynchronizationManagementService } from '../../../../core/services/synchronization/synchronization-management.service';
import { SynchroRequestModel } from '../../../../core/models/synchro-request.model';

@Component({
    selector: 'synchronization-management',
    templateUrl: 'synchronization-management.page.html',
})
export class SynchronizationManagementPage {

    synchroRequestList: SynchroRequestModel[];

    constructor(private synchronizationManagementService: SynchronizationManagementService) {
    }

    ionViewDidEnter() {
        this.synchroRequestList = this.synchronizationManagementService.getSynchroRequestList();
    }

    clearSynchroRequestList(): void {
        this.synchroRequestList = this.synchronizationManagementService.clearSynchroRequestList();
    }

}
