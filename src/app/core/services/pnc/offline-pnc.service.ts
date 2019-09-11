import * as moment from 'moment';

import { Injectable } from '@angular/core';

import { AppConstant } from '../../../app.constant';
import { EntityEnum } from '../../enums/entity.enum';
import { PageModel } from '../../models/page.model';
import { PagedPncModel } from '../../models/paged-pnc.model';
import { PncModel } from '../../models/pnc.model';
import { RotationModel } from '../../models/rotation.model';
import { StorageService } from '../../storage/storage.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class OfflinePncService {

  constructor(
    private storageService: StorageService,
    private sessionService: SessionService
  ) {
  }

  /**
   * Sauvegarde un PNC dans le cache
   * @param pnc le PNC à sauvegarder
   * @return une promesse contenant le PNC sauvé
   */
  save(pnc: PncModel): Promise<PncModel> {
    return this.storageService.saveAsync(EntityEnum.PNC, pnc);
  }

  /**
   * Récupère un PNC du cache à partir de son matricule
   * @param matricule le matricule du PNC qu'on souhaite récupérer
   * @return une promesse contenant le PNC trouvé
   */
  getPnc(matricule: string): Promise<PncModel> {
    return this.storageService.findOneAsync(EntityEnum.PNC, matricule);
  }

  /**
    * Récupère les PNCs du cache
    * @return une promesse contenant les PNC trouvés
    */
  getFilteredPncs(): Promise<PagedPncModel> {
    return this.storageService.findAllAsync(EntityEnum.PNC).then(response => {
      return this.getPnc(this.sessionService.getActiveUser().matricule).then(connectedPnc => {
        let filteredPnc = response;
        if (connectedPnc && connectedPnc.assignment && connectedPnc.assignment.division !== 'ADM') {
          filteredPnc = response.filter(pnc =>
            (pnc.assignment.division === connectedPnc.assignment.division)
            && (pnc.assignment.sector === connectedPnc.assignment.sector)
            && (pnc.matricule !== connectedPnc.matricule));
        }
        filteredPnc.sort((a, b) => a.lastName < b.lastName ? -1 : 1);
        const pagedPncResponse: PagedPncModel = new PagedPncModel();
        pagedPncResponse.content = filteredPnc;
        pagedPncResponse.page = new PageModel();
        pagedPncResponse.page.size = filteredPnc.length;
        pagedPncResponse.page.totalElements = filteredPnc.length;
        pagedPncResponse.page.number = 0;
        return pagedPncResponse;
      });
    });
  }

  /**
   * Vérifie si un pnc se trouve en cache
   * @param matricule le matricule du pnc
   * @return vrai si le pnc est trouvé en cache, faux sinon
   */
  pncExists(matricule: string): boolean {
    return this.storageService.findOne(EntityEnum.PNC, matricule) !== null;
  }

  /**
  * Retrouve les rotations opérées et à faire par un PNC
  * @param matricule le matricule du PNC dont on souhaite récupérer les rotations
  * @return une promesse contenant les rotations opérées et à faire par le PNC
   }*/
  getAllRotationsByMatricule(matricule: string): Promise<RotationModel[]> {
    return this.storageService.findAllAsync(EntityEnum.ROTATION);
  }
}
