import { UserMessageKeyEnum } from '../../enums/admin/user-message-key.enum';
import { UserMessageModel } from '../../models/admin/user-message.model';
import { Injectable } from '@angular/core';
import { EntityEnum } from '../../enums/entity.enum';

import * as moment from 'moment';
import { RestService } from '../../http/rest/rest.base.service';
import { UrlConfiguration } from '../../configuration/url.configuration';


@Injectable()
export class UserMessageService {

  constructor(private restService: RestService,
    private config: UrlConfiguration) {
  }

  /**
   * Récupère la liste de tous les messages utilisateurs
   * @return une promesse contenant tous les messages utilisateurs
   */
  public getAll(): Promise<UserMessageModel[]> {
    return this.restService.get(this.config.getBackEndUrl('userMessages'));
  }

  /**
   * Met à jour un message utilisateur
   * @param userMessage le message utilisateur à mettre à jour
   * @return une promesse contenant le message utilisateur mis à jour
   */
  public update(userMessage: UserMessageModel): Promise<UserMessageModel> {
    return this.restService.put(this.config.getBackEndUrl('userMessages'), userMessage);
  }
}
