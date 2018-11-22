import { Injectable } from '@angular/core';

import { WaypointModel } from '../../models/waypoint.model';

@Injectable()
export class WaypointTransformerService {

  constructor() {
  }

  toWaypoints(array: WaypointModel[]) {
    const newArray: WaypointModel[] = [];
    for (const object of array) {
      newArray.push(this.toWaypoint(object));
    }
    return newArray;
  }

  toWaypoint(object: WaypointModel): WaypointModel {
    return !object ?
      object :
      new WaypointModel().fromJSON(object);
  }
}
