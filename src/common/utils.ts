import { Pnc } from './../models/pnc';
import { Speciality } from './../models/speciality';
export class Utils {
    public static base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary: string = window.atob(base64);
        const length: number = binary.length;
        const buffer: ArrayBuffer = new ArrayBuffer(length);
        const view: Uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < length; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    /**
     * Verifie l'existance d'une chaine de caractères en format json et la transforme en object.
     * @param stringJson la chaine de caractères concernée
     * @return any
     */

    public static fromStringToObject(stringJson: string): any {
        if (stringJson.includes('{') && stringJson.includes('}')) {
            stringJson = stringJson.substring(stringJson.indexOf('{'), stringJson.indexOf('}') + 1);
            stringJson = stringJson.replace('\\', '');
            try {
                return JSON.parse(stringJson);
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    /**
     * Calcule et renvoie le hashcode de l'objet concerné.
     * @param obj l'objet dont on veut calculer son hashcode
     * @return le hashcode de l'objet concerné
     */
    public static getHashCode(obj: any): number {
        const prime = 3;
        let result = 1;
        for (const type in obj) {
            if (obj[type] && typeof (obj[type]) !== 'function') {
                result = result * prime + this.getCharactersUnicodeSum(JSON.stringify(obj[type]));
            }
        }
        return result;
    }

    /**
     * Renvoie la somme de l'unicode des caractères d'une chaine de caractères
     * @param string chaine de caractères concernée.
     * @return le hashcode de la chaine de caractères concernée.
     */
    public static getCharactersUnicodeSum(value: string): number {
        let hash = 0;
        if (value !== '' && typeof (value) !== 'undefined') {
            for (let i = 0; i < value.length; i++) {
                hash = hash + value.charCodeAt(i);
            }
        }
        return hash;
    }

    /**
     * Remplacement de tous les caractéres accentués par leurs pendants non accentués
     * @param text texte à traiter
     */
    replaceSpecialCaracters(text: string): string {
        const SpecialCharList = { 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ç': 'c', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y', 'ñ': 'n' };
        const reg = /[àáäâèéêëçìíîïòóôõöøùúûüÿñ]/gi;
        return text.replace(reg,
            function () {
                return SpecialCharList[arguments[0].toLowerCase()];
            }).toLowerCase();
    }
}
