import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TabHeaderModeEnum } from '../../../../core/enums/tab-header-mode.enum';
import { TabHeaderEnum } from '../../../../core/enums/tab-header.enum';
import { UserPermissionModel } from '../../../../core/models/admin/user-permission.model';
import { UserProfileModel } from '../../../../core/models/admin/user-profile.model';
import { ToastService } from '../../../../core/services/toast/toast.service';
import {
    UserPermissionService
} from '../../../../core/services/user-permission/user-permission.service';
import { UserProfileService } from '../../../../core/services/user-profile/user-profile.service';

@Component({
    selector: 'page-profile-management',
    templateUrl: 'profile-management.page.html',
    styleUrls: ['./profile-management.page.scss']
})
export class ProfileManagementPage {

    userProfiles: UserProfileModel[];
    selectedProfile: string;
    allPermissions: UserPermissionModel[];
    profilePermissions: UserPermissionModel[];

    TabHeaderModeEnum = TabHeaderModeEnum;
    TabHeaderEnum = TabHeaderEnum;

    constructor(
        private translateService: TranslateService,
        private toastService: ToastService,
        private userProfileService: UserProfileService,
        private userPermissionService: UserPermissionService) {
    }

    ionViewDidEnter() {
        this.userProfileService.getAllUserProfiles().then(userProfiles => {
            this.userProfiles = userProfiles;
        }, error => { });
    }

    goToPermissionManagement(userProfile: string) {
        // Vérifie le profil habile
        this.selectedProfile = userProfile;

        const promises = new Array();
        // Retourne la liste de toutes les permissions de l'application
        promises.push(this.userPermissionService.getAllUserPermission().then(allPermissions => {
            this.allPermissions = allPermissions;
        }, error => { }));

        // Retourne la liste des permissions en fonction de profil en paramètre
        promises.push(this.userProfileService.getUserPermissionsByUserProfile(this.selectedProfile).then(profilePermissions => {
            this.profilePermissions = profilePermissions;
        }, error => { }));

        // une fois les permissions reçues, indique si la permission appartient au profil
        Promise.all(promises).then(() => {
            this.allPermissions.forEach(permission => {
                permission.checked = this.profileHasPermission(permission);
            });
        });
    }


    /**
     * Teste si un profil possède une permission
     * @param permission la permission à tester
     * @return true si la permission en paramètre est accessible au profil utilisateur défini
     */
    profileHasPermission(permission: UserPermissionModel): boolean {
        for (const profilePermission of this.profilePermissions) {
            if (profilePermission.name === permission.name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Met à jour les permissions d'un profil
     */
    updatePermissions(): void {

        const checkedPermissions = this.allPermissions.filter(permission => {
            return permission.checked;
        });
        this.userProfileService.updatePermissions(this.selectedProfile, checkedPermissions);
        // Informe de la réussite de la mise à jour
        this.toastService.success(this.translateService.instant('ADMIN.PROFILE_MANAGEMENT.SUCCESS.PERMISSIONS_UPDATED'));
    }
}
