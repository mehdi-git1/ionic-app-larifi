import { Injectable } from '@angular/core';

import { LegModel } from '../../models/leg.model';

@Injectable({ providedIn: 'root' })
export class LegTransformerService {

    constructor() {
    }

    toLegs(array: LegModel[]) {
        const newArray: LegModel[] = [];
        for (const object of array) {
            newArray.push(this.toLeg(object));
        }
        return newArray;
    }

    toLeg(object: LegModel): LegModel {
        return !object ?
            object :
            new LegModel().fromJSON(object);
    }
}
