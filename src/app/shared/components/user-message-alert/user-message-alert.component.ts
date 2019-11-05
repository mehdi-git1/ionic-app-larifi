import { Component } from '@angular/core';

import { TextEditorModeEnum } from '../../../core/enums/text-editor-mode.enum';
import { UserMessageModel } from '../../../core/models/admin/user-message.model';
import {
    UserMessageAlertService
} from '../../../core/services/user-message/user-message-alert.service';

@Component({
  selector: 'user-message-alert',
  templateUrl: 'user-message-alert.component.html',
  styleUrls: ['./user-message-alert.component.scss']
})

export class UserMessageAlertComponent {

  displayed = false;

  userMessage = new UserMessageModel();

  TextEditorModeEnum = TextEditorModeEnum;

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
