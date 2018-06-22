import { Config } from './../../configuration/environment-variables/config';
import { Injectable } from '@angular/core';

@Injectable()
export class OfflineCareerObjectiveProvider {

  constructor(private config: Config) {
  }

}
