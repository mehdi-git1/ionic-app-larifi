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
     * verifie l'existance d'une chaine de caractères en format json et la transforme en object.
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
     * Remplacement de tous les caractéres accentués par leurs pendants non accentués
     * @param Texte texte à traiter
     */
    replaceSpecialCaracters(Texte) {
        const tabSpec = { 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ç': 'c', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y', 'ñ': 'n' };
        const reg = /[àáäâèéêëçìíîïòóôõöøùúûüÿñ]/gi;
        return Texte.replace(reg,
            function () {
                return tabSpec[arguments[0].toLowerCase()];
            }).toLowerCase();
    }

}
