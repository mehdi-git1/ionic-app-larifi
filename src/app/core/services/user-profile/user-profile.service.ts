import { Injectable } from '@angular/core';
import { RestService } from '../../http/rest/rest.base.service';
import { UserProfile } from '../../models/admin/user-profile.model';
import { UrlConfiguration } from '../../configuration/url.configuration';

@Injectable()
export class UserProfileService {

  constructor(private restService: RestService,
    private config: UrlConfiguration) {
  }

  public getAllUserProfile(): Promise<UserProfile[]> {
    return this.restService.get(this.config.getBackEndUrl('userProfiles'));
  }

}
