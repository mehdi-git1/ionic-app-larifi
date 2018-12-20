import { Injectable } from '@angular/core';

import { ParametersModel } from '../../models/parameters.model';
import { AppContextModel } from '../../models/app-context.model';
import { AuthenticatedUserModel } from '../../models/authenticated-user.model';
import { PncModel } from '../../models/pnc.model';
import { SessionService } from './session.service';

describe('Session Service', () => {
    const sessionService = new SessionService();
    const AUTHENTICATED_USER_MATRICULE = '0123456';
    const IMPERSONATED_USER_MATRICULE = '6543210';
    const WRONG_MATRICULE = 'XXXXX';
    const authenticatedPnc: PncModel = new PncModel();
    const impersonatedPnc: PncModel = new PncModel();
    const wrongPnc: PncModel = new PncModel();

    beforeEach(() => {
        sessionService.impersonatedUser = null;
        sessionService.authenticatedUser = new AuthenticatedUserModel();
        sessionService.authenticatedUser.matricule = AUTHENTICATED_USER_MATRICULE;

        authenticatedPnc.matricule = AUTHENTICATED_USER_MATRICULE;
        impersonatedPnc.matricule = IMPERSONATED_USER_MATRICULE;
        wrongPnc.matricule = WRONG_MATRICULE;
    });

    describe('Get Active User', () => {
        it('si il n\'y a pas d\'impersonnification, l\'utilisateur actif doit être l\'utilisateur connecté', () => {
            expect(sessionService.getActiveUser().matricule).toBe(AUTHENTICATED_USER_MATRICULE);
        });

        it('si il y a d\'impersonnification, l\'utilisateur actif doit être l\'utilisateur impersonnifié', () => {
            sessionService.impersonatedUser = new AuthenticatedUserModel();
            sessionService.impersonatedUser.matricule = IMPERSONATED_USER_MATRICULE;
            expect(sessionService.getActiveUser().matricule).toBe(IMPERSONATED_USER_MATRICULE);
        });
    });

    describe('Is Active User', () => {
        it('si il n\'y a pas d\'impersonnification, l\'utilisateur actif doit être l\'utilisateur connecté', () => {
            expect(sessionService.isActiveUser(authenticatedPnc)).toBe(true);
            expect(sessionService.isActiveUser(impersonatedPnc)).toBe(false);
            expect(sessionService.isActiveUser(wrongPnc)).toBe(false);
        });

        it('si il y a d\'impersonnification, l\'utilisateur actif doit être l\'utilisateur impersonnifié', () => {
            sessionService.impersonatedUser = new AuthenticatedUserModel();
            sessionService.impersonatedUser.matricule = IMPERSONATED_USER_MATRICULE;
            expect(sessionService.isActiveUser(authenticatedPnc)).toBe(false);
            expect(sessionService.isActiveUser(impersonatedPnc)).toBe(true);
            expect(sessionService.isActiveUser(wrongPnc)).toBe(false);
        });

        it('doit renvoyer false si il n\'y a de pnc', () => {
            expect(sessionService.isActiveUser(null)).toBe(false);
        });
    });

});
