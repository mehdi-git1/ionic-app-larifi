import { Leg } from './../../models/leg';
import { Injectable } from '@angular/core';

@Injectable()
export class LegTransformerProvider {

    constructor() {
    }

    toLegs(array: Leg[]) {
        const newArray: Leg[] = [];
        for (const object of array) {
            newArray.push(this.toLeg(object));
        }
        return newArray;
    }

    toLeg(object: Leg): Leg {
        return !object ?
            object :
            new Leg().fromJSON(object);
    }
}
