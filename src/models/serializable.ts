export class Serializable {
  constructor(jsonObj: Object) {
    if (!jsonObj) {
      return;
    }

    for (let prop in jsonObj) {
      if (jsonObj.hasOwnProperty(prop)) {
        this[prop] = jsonObj[prop];
      }
    }
  }
}
