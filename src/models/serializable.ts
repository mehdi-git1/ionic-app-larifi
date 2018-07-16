export class Serializable {
    /**
     * Transforme un objet json en entité
     * @param json l'objet json
     * @return l'entité correspondante au json
     */
    fromJSON(jsonObj: Object): any {
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
