import { Injectable } from '@angular/core';

import { RotationModel } from '../../models/rotation.model';

@Injectable()
export class RotationTransformerService {

    constructor() {
    }

    toRotations(array: RotationModel[]) {
        const newArray: RotationModel[] = [];
        for (const object of array) {
            newArray.push(this.toRotation(object));
        }
        return newArray;
    }

    toRotation(object: RotationModel): RotationModel {
        return !object ?
            object :
            new RotationModel().fromJSON(object);
    }
}
