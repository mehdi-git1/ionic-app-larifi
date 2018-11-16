import { Rotation } from '../../models/rotation';
import { Injectable } from '@angular/core';

@Injectable()
export class RotationTransformerProvider {

    constructor() {
    }

    toRotations(array: Rotation[]) {
        const newArray: Rotation[] = [];
        for (const object of array) {
            newArray.push(this.toRotation(object));
        }
        return newArray;
    }

    toRotation(object: Rotation): Rotation {
        return !object ?
            object :
            new Rotation().fromJSON(object);
    }
}
