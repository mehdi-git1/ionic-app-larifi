import { Component } from '@angular/core';
import { UserProfile } from '../../../../core/models/admin/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';

@Component({
    selector: 'page-profile-management',
    templateUrl: 'profile-management.page.html',
})
export class ProfileManagementPage {

    userProfiles: UserProfile[];

    constructor(private userProfileProvider: UserProfileService) {
    }

    ionViewDidEnter() {
        this.userProfileProvider.getAllUserProfile().then(userProfiles => {
            this.userProfiles = userProfiles;
        }, error => { });
    }

}
