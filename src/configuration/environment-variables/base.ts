export class BaseConfig {
  public appVersion = '';
  public backEndUrl = '/api/rest/resources';
  public pingUrl = '/api/rest/resources/me';
  public env = 'base';
  public secmobileEnv = 'rct';
  public appName = 'EDossierPnc';

  // Entrées du IonicStorage pour le mode offline
  public storageGetKey = `${this.appName}GET`;
  public storagePutKey = `${this.appName}PUT`;
  public storagePostKey = `${this.appName}POST`;
  public storageDeleteKey = `${this.appName}DELETE`;
}
