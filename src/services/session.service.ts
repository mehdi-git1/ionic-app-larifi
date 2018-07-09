import { Parameters } from './../models/Parameters';
import { AuthenticatedUser } from './../models/authenticatedUser';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {
    authenticatedUser: AuthenticatedUser;
    parameters: Parameters;
}
