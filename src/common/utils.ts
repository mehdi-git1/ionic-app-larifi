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
     * Remplacement de tous les caractéres accentués par leurs pendants non accentués
     * @param Texte texte à traiter
     */
    replaceSpecialCaracters(Texte){
        const tabSpec =   {'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ç': 'c', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ÿ': 'y', 'ñ': 'n'};
        const reg = /[àáäâèéêëçìíîïòóôõöøùúûüÿñ]/gi;
        return Texte.replace(reg,
          function(){
            return tabSpec[arguments[0].toLowerCase()];
          }).toLowerCase();
    }
}
