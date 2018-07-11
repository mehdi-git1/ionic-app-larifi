export class BaseConfig {
  public appVersion = '';
  public backEndUrl = '/api/rest/resources';
  public env = 'localhost';
  public secmobileEnv = 'rct';

  public eObsUrl = 'com.airfrance.mobile.inhouse.eformstrainingdevPNC';
  public eObsCallbackUrl = 'com.airfrance.mobile.inhouse.EDosPNC';
  public eObsCallbackActionLabel = 'Retourner à eDossierPNC';

  /**
   * Vérifie qu'on ait est en local
   * @return  vrai si on est sur l'env localhost, false sinon
   */
  public isLocalhost(): boolean {
    return this.env === 'localhost';
  }
}
