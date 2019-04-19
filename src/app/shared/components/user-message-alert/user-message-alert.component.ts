import { EntityEnum } from './../../../core/enums/entity.enum';
import { Component } from '@angular/core';
import { UserMessageAlertService } from '../../../core/services/user-message/user-message-alert.service';
import { UserMessageTransformerService } from '../../../core/services/user-message/user-message-transformer.service';
import { StorageService } from '../../../core/storage/storage.service';
import { UserMessageModel } from '../../../core/models/admin/user-message.model';

@Component({
  selector: 'user-message-alert',
  templateUrl: 'user-message-alert.component.html'
})

export class UserMessageAlertComponent {

  displayed = false;

  userMessage = new UserMessageModel();

  constructor(private userMessageAlertService: UserMessageAlertService) {

    this.userMessageAlertService.userMessageAlertCreation.subscribe(userMessage => {
      this.show(userMessage);
    });
  }

  /**
   * Affiche un message utilisateur
   * @param userMessage le message utilisateur à afficher
   */
  public show(userMessage: UserMessageModel) {
    this.userMessage = userMessage;
    this.displayed = true;
  }

  /**
   * Masque le message
   */
  public dismissMessage() {
    this.displayed = false;
    this.userMessageAlertService.removeUserMessageFromActiveUser();
  }

  /**
   * Masque le message pour les fois suivantes
   */
  public doNotDisplayMessageAnymore() {
    this.userMessageAlertService.doNotDisplayMessageAnymore(this.userMessage);
    this.dismissMessage();
  }
}
