import { PncPhoto } from './../../models/pncPhoto';
import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class OnlinePncPhotoProvider {

  private pncPhotoUrl: string;

  constructor(private restService: RestService,
    private config: Config) {
    this.pncPhotoUrl = `${config.backEndUrl}/pnc_photos`;
  }

  /**
  * Retourne la photo d'un PNC
  * @param matricule le PNC concerné
  * @return la photo du PNC
  */
  getPncPhoto(matricule: string): Promise<any> {
    return this.restService.get(`${this.pncPhotoUrl}/${matricule}`);
  }
}
