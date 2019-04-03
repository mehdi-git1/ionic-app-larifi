import { UserMessageTransformerService } from './user-message-transformer.service';
import { UserMessageKeyEnum } from './../../enums/admin/user-message-key.enum';
import { StorageService } from './../../storage/storage.service';
import { UserMessageModel } from './../../models/admin/user-message.model';
import { AlertController, Alert } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { SessionService } from '../session/session.service';
import { EntityEnum } from '../../enums/entity.enum';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class UserMessageAlertService {

  userMessageAlert: Alert;

  constructor(private alertCtrl: AlertController,
    private sessionService: SessionService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private userMessageTransformerService: UserMessageTransformerService) {
  }

  /**
   * Gère l'affichage des messages utilisateurs
   */
  handleUserMessage() {
    const userMessage = this.sessionService.authenticatedUser.userMessage;
    if (userMessage && this.displayUserMessage(userMessage)) {
      this.userMessageAlert = this.alertCtrl.create({
        title: this.translateService.instant('GLOBAL.USER_MESSAGE.TITLE'),
        message: userMessage.content,
        buttons: [
          {
            text: this.translateService.instant('GLOBAL.USER_MESSAGE.DISMISS_BUTTON'),
            role: 'dismiss',
            handler: () => {
              this.dismissUserMessage(userMessage);
            }
          }
        ]
      });
      this.userMessageAlert.present();
    }
  }

  /**
   * Vérifie si le message doit être affiché
   * @param userMessage le message
   * @return vrai si le message doit être affiché, faux sinon
   */
  private displayUserMessage(userMessage: UserMessageModel): boolean {
    const storedUserMessage = this.storageService.findOne(EntityEnum.USER_MESSAGE, UserMessageKeyEnum.INSTRUCTOR_MESSAGE);
    return !storedUserMessage || !storedUserMessage.lastUpdate || this.userMessageIsFresher(userMessage, storedUserMessage);
  }

  /**
   * Vérifie si le message reçu du serveur est plus récent que celui que l'utilisateur a précédemment vu (celui en cache).
   * @param userMessage le message reçu du serveur
   * @param storedUserMessage le message stocké en cache
   * @return vrai si le message reçu du serveur est plus récent que celui stocké en cache
   */
  private userMessageIsFresher(userMessage, storedUserMessage) {
    return moment(userMessage.lastUpdate).isAfter(storedUserMessage.lastUpdate);
  }

  /**
   * Masque le message pour les fois suivantes
   * @param userMessage le message qu'on souhaite masquer à l'avenir
   */
  private dismissUserMessage(userMessage: UserMessageModel) {
    this.storageService.saveAsync(EntityEnum.USER_MESSAGE, this.userMessageTransformerService.toUserMessage(userMessage), true);
  }
}
