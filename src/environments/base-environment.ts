
export abstract class BaseEnvironment {
  public appVersion = '';
  public contextRoot = '/api/';
  public backEndUrl = `${this.contextRoot}rest/resources`;
  public secmobileEnv = 'rct';
  public appName = 'EDossierPnc';
  public env = 'localhost';
  public versionFileUrl = `${this.contextRoot}version.json`;

  public eObsUrl = 'com.airfrance.mobile.inhouse.eformstrainingdevPNC';
  public eObsCallbackUrl = 'com.airfrance.mobile.inhouse.edospncDEV';
  public eObsCallbackActionLabel = 'Retour eDossierPNC';

  public makeOfflineModeAvailable = false;

  /**
   * Vérifie qu'on est en local
   * @return  vrai si on est sur l'env localhost, false sinon
   */
  public isLocalhost(): boolean {
    return this.env === 'localhost';
  }

}
