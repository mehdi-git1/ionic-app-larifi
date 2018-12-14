import { UserProfile } from './../../../../core/models/admin/user-profile.model';
import { Component } from '@angular/core';
import { UserPermission } from '../../../../core/models/admin/user-permission.model';
import { UserPermissionService } from '../../../../core/services/user-permission/user-permission.service';


@Component({
    selector: 'page-permission-management',
    templateUrl: 'permission-management.page.html',
})
export class PermissionManagementPage {

    userPermissions: UserPermission[];

    constructor(private userPermissionProvider: UserPermissionService) {
    }

    ionViewDidEnter() {
        this.userPermissionProvider.getAllUserPermission().then(userPermissions => {
            this.userPermissions = userPermissions;
        }, error => { });
    }





}
