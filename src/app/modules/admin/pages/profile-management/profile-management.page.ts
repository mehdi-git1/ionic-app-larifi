import { Component } from '@angular/core';
import { UserProfile } from '../../../../core/models/admin/user-profile.model';
import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';

import { PermissionManagementPage } from './../permission-management/permission-management.page';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-profile-management',
    templateUrl: 'profile-management.page.html',
})
export class ProfileManagementPage {

    userProfiles: UserProfile[];

    constructor(private userProfileProvider: UserProfileService, private navCtrl: NavController) {
    }

    ionViewDidEnter() {
        this.userProfileProvider.getAllUserProfile().then(userProfiles => {
            this.userProfiles = userProfiles;
        }, error => { });
    }

    goToPermissionManagement(profileSelected: string) {
        console.log('le profil choisi est ' + profileSelected);
        this.navCtrl.push(PermissionManagementPage);

    }

}
