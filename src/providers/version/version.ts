import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestService } from '../../services/rest/rest.base.service';
import { Config } from '../../configuration/environment-variables/config';

@Injectable()
export class VersionProvider {

  constructor(public restService: RestService,
    private config: Config) {
  }

  /**
   * Récupère le numéro de version du back
   * @return le numéro de version du back
   */
  getbackVersion(): Promise<string> {
    return this.restService.get(this.config.backEndVersionUrl);
  }
}
