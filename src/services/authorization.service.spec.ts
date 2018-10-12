import { SessionService } from './session.service';
import { TranslateService } from '@ngx-translate/core';
import { IonicModule, Platform, NavController, NavParams } from 'ionic-angular';
import { NO_ERRORS_SCHEMA, Component, DebugElement, ElementRef } from '@angular/core';
import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { } from 'jasmine';
import {By} from "@angular/platform-browser";
import {
    NavMock,
    PlatformMock
} from '../test-config/mocks-ionic';
import { AuthorizationService } from './authorization.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { AuthenticatedUser } from '../models/authenticatedUser';
import { AppContext } from '../models/appContext';
import { Parameters } from '../models/Parameters';

const sessionServiceMock = jasmine.createSpyObj('sessionServiceMock', ['']);

describe('Service: AuthenticationService', () => {

    let authorizationService: AuthorizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthorizationService]
        });

        authorizationService = new AuthorizationService(sessionServiceMock);
    });

    it('User has right to show impersonnification', () => {

        const authenticatedUser = new AuthenticatedUser();
        authenticatedUser.permissions = new Array();
        authenticatedUser.permissions.push("SHOW_IMPERSONNIFICATION");

        sessionServiceMock.authenticatedUser = authenticatedUser;
        expect(authorizationService.hasPermission("SHOW_IMPERSONNIFICATION")).toBe(true);
    });

});
