import { Injectable } from '@angular/core';

import { BaseEnvironment } from './base-environment';

declare var window: any;

@Injectable()
export class Config extends BaseEnvironment {
  constructor() {
    super();
    this.appVersion = '1.2.0';
    this.contextRoot = '/api/';

    this.appName = 'EDossierPnc';

    this.makeOfflineModeAvailable = false;

    if (undefined !== window.cordova && 'browser' !== window.cordova.platformId) {
      this.contextRoot = 'https://edospnc-api-dev.airfrance.fr/api/';
    }

    this.backEndUrl = `${this.contextRoot}rest/resources`;
    this.versionFileUrl = `${this.contextRoot}version.json`;
    this.env = 'localhost';
    this.secmobileEnv = 'rct';
    this.eObsUrl = 'com.airfrance.mobile.inhouse.eformsdevPNC';
    this.eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncDEV';
    this.eObsCallbackActionLabel = 'Retour eDossierPNC';
  }

  /**
    * Vérifie qu'on est en local
    * @return  vrai si on est sur l'env localhost, false sinon
    */
  isLocalhost(): boolean {
    return this.env === 'localhost';
  }
}
