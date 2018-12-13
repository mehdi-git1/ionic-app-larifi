
export abstract class BaseEnvironment {
  public appVersion = '1.3.0';
  public contextRoot = '/api/';
  public appName = 'EDossierPnc';
  public backEndUrl;
  public secmobileEnv;

  public env;
  public versionFileUrl;

  public eObsUrl;
  public eObsCallbackUrl;
  public eObsCallbackActionLabel;

  public makeOfflineModeAvailable = true;

  /**
  * Vérifie qu'on est en local
  * @return  vrai si on est sur l'env localhost, false sinon
  */
  isLocalhost(): boolean {
    return this.env === 'localhost';
  }
}
