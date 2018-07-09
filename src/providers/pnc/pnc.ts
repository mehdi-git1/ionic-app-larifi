import { Observable } from 'rxjs/Observable';
import { Config } from './../../configuration/environment-variables/config';
import { Rotation } from './../../models/rotation';
import { Pnc } from './../../models/pnc';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest.base.service';

@Injectable()
export class PncProvider {
  private pncUrl: string;

  constructor(public restService: RestService,
    public config: Config) {
    this.pncUrl = `${config.backEndUrl}/pncs`;
  }

  /**
   * Fait appel au service rest qui renvois les informations.
   * @param matricule
   * @return les informations du pnc
   */
  getPnc(matricule: string): Observable<Pnc> {
    const obs: Observable<Pnc> = new Observable<Pnc>(observer => {
      if (navigator.onLine) {

        this.restService.get(`${this.pncUrl}/${matricule}`)
          .then(r => {
            let pnc = new Pnc();
            if (r != null) {
              pnc = <Pnc>r;
            }
            observer.next(pnc);
            observer.complete();
          })
          .catch(r => {
          });
      }
    });
    return obs;
  }

  /**
   * Retrouve les rotations à venir d'un PNC
   * @param matricule le matricule du PNC dont on souhaite récupérer les rotations à venir
   * @return les rotations à venir du PNC
   */
  getUpcomingRotations(matricule: string): Promise<Rotation[]> {
    return this.restService.get(`${this.pncUrl}/${matricule}/upcoming_rotations`);
  }

  /**
  * Retrouve la dernière rotation opérée par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer la dernière rotation opérée
  * @return la dernière rotation opérée par le PNC
  */
  getLastPerformedRotation(matricule: string): Promise<Rotation> {
    return this.restService.get(`${this.pncUrl}/${matricule}/last_performed_rotation`);
  }
}

