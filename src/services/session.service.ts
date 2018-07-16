import { Parameters } from './../models/Parameters';
import { AppContext } from './../models/appContext';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    authenticatedUser: AuthenticatedUser;
    appContext: AppContext = new AppContext();
    parameters: Parameters;
}
