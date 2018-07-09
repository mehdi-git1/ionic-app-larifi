export class BaseConfig {
  public appVersion = '';
  public backEndUrl = '/api/rest/resources';
  public env = 'localhost';
  public secmobileEnv = 'rct';

  /**
   * Vérifie qu'on ait est en local
   * @return  vrai si on est sur l'env localhost, false sinon
   */
  public isLocalhost(): boolean {
    return this.env === 'localhost';
  }
}
