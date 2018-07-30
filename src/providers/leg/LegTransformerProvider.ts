import { Leg } from './../../models/Leg';
import { Injectable } from '@angular/core';

@Injectable()
export class LegTransformerProvider {

    constructor() {
    }

    toRotations(array: Leg[]) {
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
