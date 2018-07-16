import { Injectable } from '@angular/core';
import { Waypoint } from '../../models/waypoint';

@Injectable()
export class WaypointTransformerProvider {

  constructor() {
  }

  toWaypoints(array: Waypoint[]) {
    const newArray: Waypoint[] = [];
    for (const object of array) {
      newArray.push(this.toWaypoint(object));
    }
    return newArray;
  }

  toWaypoint(object: Waypoint): Waypoint {
    return !object ?
      object :
      new Waypoint(object);
  }
}
