import { RotationTransformerProvider } from './rotation-transformer';
import { OfflineRotationProvider } from './offline-rotation';
import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { OfflineProvider } from '../offline/offline';

@Injectable()
export class OnlineRotationProvider {

    private rotationUrl: string;

    constructor(private restService: RestService,
        private offlineRotationProvider: OfflineRotationProvider,
        private rotationTransformer: RotationTransformerProvider,
        private offlineProvider: OfflineProvider,
        private config: Config) {
        this.rotationUrl = `${config.backEndUrl}/rotations`;
    }

    /**
    * Récupère les tronçons d'une rotation
    * @param rotation la rotation dont on souhaite récupérer les tronçons
    * @return la liste des tronçons de la rotation
    */
    getRotationLegs(rotation: Rotation): Promise<Leg[]> {
        return this.restService.get(`${this.rotationUrl}/${rotation.techId}/legs`);
    }

    /**
     * Met à jour la date de mise en cache dans l'objet online
     * @param rotation objet online
     */
    refreshOfflineStorageDate(rotation: Rotation) {
        this.offlineRotationProvider.getRotation(rotation.techId).then(offlineRotation => {
            const offlineData = this.rotationTransformer.toRotation(offlineRotation);
            this.offlineProvider.flagDataAvailableOffline(rotation, offlineData);
        });
    }
}
