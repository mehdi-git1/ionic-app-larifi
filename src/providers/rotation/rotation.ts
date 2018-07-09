import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Leg } from './../../models/leg';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class RotationProvider {

  private rotationUrl: string;

  constructor(private restService: RestService,
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
}
