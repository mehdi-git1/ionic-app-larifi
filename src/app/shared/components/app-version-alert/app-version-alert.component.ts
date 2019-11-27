import { Component } from '@angular/core';

import { TextEditorModeEnum } from '../../../core/enums/text-editor-mode.enum';
import { AppVersionModel } from '../../../core/models/admin/app-version.model';
import {
    AppVersionAlertService
} from '../../../core/services/app-version/app-version-alert.service';

@Component({
  selector: 'app-version-alert',
  templateUrl: 'app-version-alert.component.html',
  styleUrls: ['./app-version-alert.component.scss']
})

export class AppVersionAlertComponent {

  displayed = false;

  appVersion = new AppVersionModel();

  TextEditorModeEnum = TextEditorModeEnum;

  constructor(private appVersionAlertService: AppVersionAlertService) {

    this.appVersionAlertService.appVersionAlertCreation.subscribe(appVersion => {
      this.show(appVersion);
    });
  }

  /**
   * Affiche une version
   * @param appVersion la version à afficher
   */
  public show(appVersion: AppVersionModel) {
    this.appVersion = appVersion;
    this.displayed = true;
  }

  /**
   * Masque la version pour les fois suivantes
   */
  public doNotDisplayMessageAnymore() {
    this.appVersionAlertService.doNotDisplayMessageAnymore(this.appVersion);
    this.displayed = false;
  }
}
