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
     * Remplace tous les caractéres accentués par leurs pendants non accentués
     * @param text texte à traiter
     * @return la chaine "assainie"
     */
    public static replaceSpecialCaracters(text): string {
        const SpecialCharList = { 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ç': 'c', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y', 'ñ': 'n' };
        const reg = /[àáäâèéêëçìíîïòóôõöøùúûüÿñ]/gi;
        return text.replace(reg,
            function () {
                return SpecialCharList[arguments[0].toLowerCase()];
            }).toLowerCase();
    }

    /**
     * Supprime les espaces de la chaine de caractère donnée
     * @param text le texte à traiter
     * @return le nouveau texte, dépourvu de tout espace
     */
    public static removeSpaces(text: string): string {
        return text.replace(/\s+/g, '');
    }

    /**
     * Vérifie qu'une chaine de caractère est vide
     * @param value chaîne de caractères
     * @return true si elle est vide ou null
     */
    public static isEmpty(value: any): boolean {
        return !value || value == null || (typeof value === 'string' && value.trim() === '');
    }

    /**
     * Capitalise un mot
     * @param word mot à capitaliser
     * @return mot capitalisé
     */
    public static capitalize(word: string): string {
        if (!word) {
            return word;
        }
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }

    /**
     * Récupère une chaine de caractère vide si la valeur est null
     * @param value la chaine à traiter
     * @return une chaine vide, ou la valeur passée en paramètre si celle ci est non null
     */
    public static getEmptyStringIfNull(value: string) {
        return value == null ? '' : value;
    }

    /**
     * Compare deux numéros de version
     * @param v1 le premier numéro de version
     * @param v2 le second numéro de version
     * @return 0 si les deux numéros sont égaux, 1 si est après v2, -1 si v1 est avant v2
     */
    public static compareVersionNumbers(v1, v2) {
        const v1SubVersionNumbers = v1.split('.');
        const v2SubVersionNumbers = v2.split('.');

        if (!this.subVersionNumbersFormatIsValid(v1SubVersionNumbers) || !this.subVersionNumbersFormatIsValid(v2SubVersionNumbers)) {
            return NaN;
        }

        for (let i = 0; i < v1SubVersionNumbers.length; ++i) {
            if (v2SubVersionNumbers.length === i) {
                return 1;
            }

            if (v1SubVersionNumbers[i] === v2SubVersionNumbers[i]) {
                continue;
            }
            if (v1SubVersionNumbers[i] > v2SubVersionNumbers[i]) {
                return 1;
            }
            return -1;
        }

        if (v1SubVersionNumbers.length !== v2SubVersionNumbers.length) {
            return -1;
        }

        return 0;
    }

    /**
     * Vérifie que le format d'une liste de sous numéros de version est valide
     * @param subVersionNumbers un tableau contenant les sous numéros de version
     * @return vrai si c'est les sous numéros de version sont au bon format, faux sinon
     */
    private static subVersionNumbersFormatIsValid(subVersionNumbers: Array<any>): boolean {
        for (const subVersion of subVersionNumbers) {
            if (!this.isPositiveInteger(subVersion)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Vérifie qu'un chaine de caractère représente bien un entier positif
     * @param num le nombre sous forme de chaîne de caractère à tester
     * @return vrai si c'est le cas, faux sinon
     */
    private static isPositiveInteger(num: string): boolean {
        return /^\d+$/.test(num);
    }
}
