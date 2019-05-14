import { EntityEnum } from '../../../core/enums/entity.enum';
import { Component } from '@angular/core';
import { AppVersionAlertService } from '../../../core/services/app-version/app-version-alert.service';
import { AppVersionTransformerService } from '../../../core/services/app-version/app-version-transformer.service';
import { StorageService } from '../../../core/storage/storage.service';
import { AppVersionModel } from '../../../core/models/admin/app-version.model';

@Component({
  selector: 'app-version-alert',
  templateUrl: 'app-version-alert.component.html'
})

export class AppVersionAlertComponent {

  displayed = true;

  appVersion = new AppVersionModel();

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
    appVersion = new AppVersionModel();
    appVersion.number = '1.8.0';
    appVersion.changelog = 'La nouvelle version arrive';
    this.appVersion = appVersion;
    this.displayed = true;
  }

  /**
   * Masque la version
   */
  public dismissMessage() {
    this.displayed = false;
    this.appVersionAlertService.removeAppVersionFromActiveUser();
  }

  /**
   * Masque la version pour les fois suivantes
   */
  public doNotDisplayMessageAnymore() {
    this.appVersionAlertService.doNotDisplayMessageAnymore(this.appVersion);
    this.dismissMessage();
  }
}
