import { Injectable } from '@angular/core';

import { EntityEnum } from '../../enums/entity.enum';
import { RotationModel } from '../../models/rotation.model';
import { LegModel } from '../../models/leg.model';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class OfflineRotationService {

    constructor(private storageService: StorageService) {
    }

    /**
    * Récupère les tronçons d'une rotation
    * @param rotation la rotation dont on souhaite récupérer les tronçons
    * @return la liste des tronçons de la rotation
    */
    getRotationLegs(rotation: RotationModel): Promise<LegModel[]> {
        return new Promise((resolve, reject) => {
            const legs = this.storageService.findAll(EntityEnum.LEG);
            resolve(legs.filter(leg => leg.rotation.techId === rotation.techId));
        });
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
