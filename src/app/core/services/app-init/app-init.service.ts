import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppInitService {

    constructor(
    ) {
    }

    initApp(): Promise<any> {
        return Promise.resolve();
    }
}

