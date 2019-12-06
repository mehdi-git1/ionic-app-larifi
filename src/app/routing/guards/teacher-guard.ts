import { Observable } from 'rxjs';
import { SpecialityEnum } from 'src/app/core/enums/speciality.enum';
import { PncService } from 'src/app/core/services/pnc/pnc.service';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { PermissionConstant } from '../../core/constants/permission.constant';
import { AuthorizationService } from '../../core/services/authorization/authorization.service';

@Injectable()
export class TeacherGuard implements CanActivate {
    constructor(
        private authorizationService: AuthorizationService,
        private pncService: PncService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.pncService.getPnc(route.paramMap.get('visitedPncMatricule')).then(pnc => {
            return pnc.currentSpeciality === SpecialityEnum.ALT
                && this.authorizationService.hasPermission(PermissionConstant.VIEW_ALTERNANT_SEARCH);
        });
    }
}
