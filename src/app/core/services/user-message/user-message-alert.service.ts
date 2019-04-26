import { UserMessageTransformerService } from './user-message-transformer.service';
import { UserMessageKeyEnum } from './../../enums/admin/user-message-key.enum';
import { StorageService } from './../../storage/storage.service';
import { UserMessageModel } from './../../models/admin/user-message.model';
import { Injectable, EventEmitter } from '@angular/core';
import { SessionService } from '../session/session.service';
import { EntityEnum } from '../../enums/entity.enum';

import * as moment from 'moment';
import { DeviceService } from '../device/device.service';


@Injectable()
export class UserMessageAlertService {

  userMessageAlertCreation = new EventEmitter<UserMessageModel>();

  constructor(
    private sessionService: SessionService,
    private storageService: StorageService,
    private userMessageTransformerService: UserMessageTransformerService,
    private deviceService: DeviceService
  ) {
  }

  /**
   * Gère l'affichage des messages utilisateurs
   */
  handleUserMessage() {
    const userMessage = this.sessionService.authenticatedUser.userMessage;
    if (userMessage && this.isUserMessageToDisplay(userMessage)) {
      this.displayUserMessage(userMessage);
    }
  }

  /**
   * Affiche un message utilisateur
   * @param userMessage le message utilisateur à afficher
   */
  public displayUserMessage(userMessage: UserMessageModel) {
    this.userMessageAlertCreation.emit(userMessage);
  }

  /**
   * Vérifie si le message doit être affiché.
   * Le message ne doit être affiché qu'en mobile, et si celui ci n'est pas stocké en cache avec une date plus ancienne que celui reçu.
   * @param userMessage le message
   * @return vrai si le message doit être affiché, faux sinon
   */
  private isUserMessageToDisplay(userMessage: UserMessageModel): boolean {
    const storedUserMessage = this.storageService.findOne(EntityEnum.USER_MESSAGE, UserMessageKeyEnum.INSTRUCTOR_MESSAGE);
    return !this.deviceService.isBrowser() &&
      (!storedUserMessage || !storedUserMessage.lastUpdateDate || this.userMessageIsFresher(userMessage, storedUserMessage));
  }

  /**
   * Vérifie si le message reçu du serveur est plus récent que celui que l'utilisateur a précédemment vu (celui en cache).
   * @param userMessage le message reçu du serveur
   * @param storedUserMessage le message stocké en cache
   * @return vrai si le message reçu du serveur est plus récent que celui stocké en cache
   */
  private userMessageIsFresher(userMessage, storedUserMessage) {
    return moment(userMessage.lastUpdateDate).isAfter(storedUserMessage.lastUpdateDate);
  }

  /**
   * Masque le message pour les fois suivantes
   * @param userMessage le message qu'on souhaite masquer à l'avenir
   */
  public doNotDisplayMessageAnymore(userMessage: UserMessageModel) {
    this.storageService.saveAsync(EntityEnum.USER_MESSAGE, this.userMessageTransformerService.toUserMessage(userMessage), true);
  }

  /**
   * Supprime le message utilisateur de l'utilisateur en session
   */
  public removeUserMessageFromActiveUser() {
    this.sessionService.getActiveUser().userMessage = undefined;
  }

}
