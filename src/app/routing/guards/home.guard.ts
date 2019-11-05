import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from '../../core/authentication/authentication.service';

@Injectable()
export class HomeGuard implements CanActivate {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (route.url.length === 0) {
        }
        return true;
    }
}
