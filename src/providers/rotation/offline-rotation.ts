import { Entity } from './../../models/entity';
import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';
import { StorageService } from './../../services/storage.service';

@Injectable()
export class OfflineRotationProvider {

    private rotationUrl: string;

    constructor(private storageService: StorageService) {
    }

    /**
    * Récupère les tronçons d'une rotation
    * @param rotation la rotation dont on souhaite récupérer les tronçons
    * @return la liste des tronçons de la rotation
    */
    getRotationLegs(rotation: Rotation): Promise<Leg[]> {
        return new Promise((resolve, reject) => {
            let legs = this.storageService.findAll(Entity.LEG);
            legs.filter(leg => leg.rotation.techId === rotation.techId);
            resolve(legs);
        });
    }

    /**
    * Récupère une rotation
    * @param rotationId l'id de la rotation
    * @return la rotation demandée
    */
    getRotation(rotationId: number): Promise<Rotation> {
        return this.storageService.findOne(Entity.ROTATION, '${rotationId}');
    }
}
