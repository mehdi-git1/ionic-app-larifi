export class Serializable {
  /**
   * Transforme un objet json en entité
   * @param json l'objet json
   * @return l'entité correspondante au json
   */
  fromJSON(jsonObj: Object): any {
    if (jsonObj) {
      for (const prop in jsonObj) {
        if (jsonObj.hasOwnProperty(prop)) {
          this[prop] = jsonObj[prop];
        }
      }
    }

    return this;
  }
}
