import { Entity } from './../../models/entity';
import { StatutoryReporting } from './../../models/statutoryReporting/statutory-reporting';
import { StorageService } from './../../services/storage.service';
import { Injectable } from '@angular/core';
import { Stage } from '../../models/statutoryReporting/stage';


@Injectable()
export class OfflineStatutoryReportingProvider {

    constructor(private storageService: StorageService) {
    }

    /**
     * Récupère le suivi réglementaire d'un PNC
     * @param matricule le matricule du PNC dont on souhaite récupérer le suivi réglementaire
     * @return le suivi réglementaire du PNC
     */
    getStatutoryReporting(matricule: string): Promise<StatutoryReporting> {
        return this.storageService.findOneAsync(Entity.STATUTORY_REPORTING, matricule);
    }
}
