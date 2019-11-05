import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { LegModel } from '../../models/leg.model';
import { RotationModel } from '../../models/rotation.model';
import { StorageService } from '../../storage/storage.service';
import { RotationTransformerService } from './rotation-transformer.service';

@Injectable({ providedIn: 'root' })
export class OfflineRotationService {

    constructor(
        private storageService: StorageService,
        private rotationTransformerService: RotationTransformerService) {
    }

    /**
     * Récupère les tronçons d'une rotation
     * @param rotation la rotation dont on souhaite récupérer les tronçons
     * @return la liste des tronçons de la rotation
     */
    getRotationLegs(rotation: RotationModel): Promise<LegModel[]> {
        const legs = this.storageService.findAll(EntityEnum.LEG);
        return Promise.resolve(
            legs.filter(leg => leg.rotationStorageId === this.rotationTransformerService.toRotation(rotation).getStorageId())
        );
    }

    /**
     * Récupère une rotation du cache à partir de son id
     * @param rotationId l'id de la rotation qu'on souhaite récupérer
     * @return une promesse contenant la rotation trouvée
     */
    getRotation(rotationId: number): Promise<RotationModel> {
        return this.storageService.findOneAsync(EntityEnum.ROTATION, `${rotationId}`);
    }

}
